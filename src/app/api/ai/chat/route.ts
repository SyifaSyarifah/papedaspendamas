/**
 * src/app/api/ai/chat/route.ts
 * Task 2.1 — AI Gateway untuk percakapan AI Chat di /plan
 *
 * Endpoint: POST /api/ai/chat
 * Fungsi: Menerima pesan dari AIChatInterface, meneruskan ke Groq Cloud API,
 * dan mengembalikan preferensi terstruktur + balasan percakapan.
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '../../../../lib/ai/groqClient';
import { CHAT_SYSTEM_PROMPT } from '../../../../lib/ai/prompts';
import { parseChatResponse, isPreferencesComplete } from '../../../../lib/ai/parser';

export const runtime = 'nodejs';

// ─── Tipe Request ─────────────────────────────────────────────────────────────

interface IncomingMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatRequestBody {
  /** Riwayat percakapan (multi-turn support) */
  messages: IncomingMessage[];
  /** Preferensi yang sudah terekstrak di percakapan sebelumnya */
  currentPreferences?: Record<string, unknown>;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Field "messages" wajib diisi dan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Ambil pesan terakhir dari user
    const lastUserMessage = [...body.messages]
      .reverse()
      .find((m) => m.sender === 'user');

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'Tidak ada pesan dari user.' },
        { status: 400 }
      );
    }

    // Susun riwayat percakapan untuk multi-turn context
    // Format: hanya sertakan max 6 pesan terakhir untuk menghemat token
    const historyMessages = body.messages.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: msg.text,
    }));

    // Tambahkan konteks preferensi saat ini ke pesan user jika ada
    const currentPrefsContext =
      body.currentPreferences && Object.keys(body.currentPreferences).length > 0
        ? `\n\n[Preferensi yang sudah tercatat: ${JSON.stringify(body.currentPreferences)}]`
        : '';

    // Override konten pesan terakhir dengan konteks preferensi
    if (historyMessages.length > 0 && currentPrefsContext) {
      historyMessages[historyMessages.length - 1].content += currentPrefsContext;
    }

    // Panggil Groq API
    const result = await callGroq({
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...historyMessages,
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    // Parse & validasi output LLM
    const parsed = parseChatResponse(result.content);

    // Cek apakah preferensi sudah lengkap untuk redirect
    const isComplete = isPreferencesComplete(parsed.preferences);

    return NextResponse.json({
      extractedPreferences: parsed.preferences,
      intent: parsed.intent,
      missingParameters: parsed.missingParameters,
      isComplete,
      reply: parsed.conversationalReply,
      quickChoices: isComplete
        ? ['Lihat Rekomendasi Destinasi', ...parsed.quickChoices.slice(0, 2)]
        : parsed.quickChoices,
      _meta: {
        model: result.model,
        tokens: result.usage.total_tokens,
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error('[/api/ai/chat] Error:', error.message);

    // Timeout atau koneksi terputus
    if (error.message.includes('GROQ_TIMEOUT') || error.message.includes('fetch failed')) {
      return NextResponse.json(
        {
          error: 'GATRA AI sedang offline atau koneksi internet terputus.',
          isOffline: true,
          fallbackMessage:
            'GATRA AI sedang offline. Kamu tetap bisa menyusun itinerary lewat Quick Planner ya!',
        },
        { status: 503 }
      );
    }

    // API Key tidak ada
    if (error.message.includes('GROQ_API_KEY')) {
      return NextResponse.json(
        {
          error: 'Konfigurasi GROQ_API_KEY belum diatur.',
          isOffline: true,
          fallbackMessage:
            'GATRA AI belum dikonfigurasi. Gunakan Quick Planner untuk menyusun perjalananmu.',
        },
        { status: 503 }
      );
    }

    // Error umum
    return NextResponse.json(
      {
        error: 'Terjadi kesalahan internal.',
        isOffline: true,
        fallbackMessage: 'GATRA AI sedang offline. Silakan coba lagi atau gunakan Quick Planner.',
      },
      { status: 500 }
    );
  }
}
