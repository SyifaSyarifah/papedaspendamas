/**
 * groqClient.ts
 * Adapter untuk memanggil Groq Cloud API.
 * Seluruh pemrosesan LLM berjalan di server Groq (0 RAM laptop).
 * Next.js dev server hanya bertindak sebagai proxy/orchestrator.
 */

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Model yang tersedia di Groq (gratis, tidak perlu GPU lokal).
 * Daftar model aktif: https://console.groq.com/docs/models
 * - qwen/qwen3.8-27b    : Primary — tested, fast, returns valid JSON ✅
 * - openai/gpt-oss-120b : Fallback (currently returns empty responses)
 */
export const GROQ_MODELS = {
  primary: 'qwen/qwen3.8-27b',
  fallback: 'openai/gpt-oss-120b',
} as const;

export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS];

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  model?: GroqModel;
  messages: GroqMessage[];
  /** Gunakan nilai rendah (0.1–0.3) agar output JSON lebih deterministik */
  temperature?: number;
  /** Batasi panjang respons agar hemat token */
  max_tokens?: number;
  /** Timeout fetch dalam milidetik (default: 10 detik) */
  timeoutMs?: number;
}

export interface GroqCompletionResult {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Memanggil Groq Cloud API dan mengembalikan konten teks dari respons.
 * Wajib dijalankan di server (API Route Next.js), bukan di browser.
 */
export async function callGroq(
  options: GroqCompletionOptions
): Promise<GroqCompletionResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY tidak ditemukan. Tambahkan variabel lingkungan di file .env.local'
    );
  }

  const {
    model = GROQ_MODELS.primary,
    messages,
    temperature = 0.2,
    max_tokens = 1024,
    timeoutMs = 10000,
  } = options;

  // Buat AbortController untuk timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        // Catatan: tidak memakai response_format json_object karena tidak semua
        // model Groq mendukungnya. JSON output dipaksakan via system prompt.
        // Qwen3 thinking tags (<think>...</think>) ditangani oleh parser.ts.
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    const content: string = data.choices?.[0]?.message?.content ?? '';
    const usage = data.usage ?? {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    return { content, model: data.model ?? model, usage };
  } catch (err) {
    clearTimeout(timeoutId);

    if ((err as Error).name === 'AbortError') {
      throw new Error('GROQ_TIMEOUT: Koneksi ke Groq melebihi batas waktu 10 detik.');
    }
    throw err;
  }
}
