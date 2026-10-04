/**
 * parser.ts
 * Fungsi validasi & parsing output JSON dari Groq LLM.
 *
 * LLM kadang mengembalikan JSON yang sedikit kotor (terbungkus markdown code block, dll).
 * File ini membersihkan dan memvalidasi output sebelum digunakan oleh sistem.
 */

import { DestinationCategory } from '../../types/destination';
import { TripDuration, TransportType, TravelStyle } from '../../types/planner';

// ─── Tipe Output AI ──────────────────────────────────────────────────────────

export interface AIExtractedPreferences {
  budget: number | null;
  duration: TripDuration | null;
  interests: DestinationCategory[];
  transport: TransportType | null;
  travelStyle: TravelStyle | null;
  startLocation: string | null;
}

export interface AIChatResponse {
  intent: 'create_trip' | 'replan' | 'inquire' | 'out_of_scope';
  preferences: AIExtractedPreferences;
  missingParameters: string[];
  conversationalReply: string;
  quickChoices: string[];
}

export interface AIExplainResponse {
  explanation: string;
}

export interface AIReplanResponse {
  replanAction: 'reduce_budget' | 'change_culinary' | 'change_destination' | 'make_relaxed' | 'custom';
  newBudget: number | null;
  targetDestinationId: string | null;
  targetCulinaryId: string | null;
  naturalInstruction: string;
  confirmationMessage: string;
}

// ─── Konstanta Validasi ───────────────────────────────────────────────────────

const VALID_INTENTS = new Set(['create_trip', 'replan', 'inquire', 'out_of_scope']);
const VALID_DURATIONS = new Set<TripDuration>(['half_day', '1_day', '2_days']);
const VALID_TRANSPORTS = new Set<TransportType>(['motor', 'mobil', 'umum']);
const VALID_TRAVEL_STYLES = new Set<TravelStyle>(['santai', 'padat', 'seimbang']);
const VALID_INTERESTS = new Set<DestinationCategory>([
  'sejarah', 'religi', 'alam', 'kuliner', 'keluarga', 'edukasi',
]);

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Membersihkan output LLM dari markdown code block wrapper jika ada.
 * LLM kadang mengembalikan: ```json\n{...}\n```
 * Qwen3 juga menambahkan <think>...</think> block sebelum output JSON.
 */
export function extractRawJson(raw: string): string {
  // 1. Hapus Qwen3 thinking block jika ada
  const withoutThinking = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Hapus markdown code block wrapper
  const codeBlockMatch = withoutThinking.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // 3. Ekstrak objek JSON langsung dari teks
  const jsonMatch = withoutThinking.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return withoutThinking.trim();
}

/**
 * Parse JSON dengan error handling yang jelas.
 */
function safeParse(raw: string): unknown {
  const cleaned = extractRawJson(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`JSON parsing gagal. Raw output dari LLM: ${cleaned.substring(0, 200)}`);
  }
}

// ─── Parser Utama ─────────────────────────────────────────────────────────────

/**
 * Parse dan validasi respons dari endpoint /api/ai/chat
 */
export function parseChatResponse(raw: string): AIChatResponse {
  const data = safeParse(raw) as Record<string, unknown>;

  // Validasi & normalisasi intent
  const intent = VALID_INTENTS.has(data.intent as string)
    ? (data.intent as AIChatResponse['intent'])
    : 'inquire';

  // Validasi & normalisasi preferences
  const rawPrefs = (data.preferences ?? {}) as Record<string, unknown>;

  const rawInterests = Array.isArray(rawPrefs.interests) ? rawPrefs.interests : [];
  const interests = rawInterests.filter((i): i is DestinationCategory =>
    VALID_INTERESTS.has(i as DestinationCategory)
  );

  const budget =
    typeof rawPrefs.budget === 'number' && rawPrefs.budget > 0
      ? Math.round(rawPrefs.budget)
      : null;

  const duration = VALID_DURATIONS.has(rawPrefs.duration as TripDuration)
    ? (rawPrefs.duration as TripDuration)
    : '1_day';

  const transport = VALID_TRANSPORTS.has(rawPrefs.transport as TransportType)
    ? (rawPrefs.transport as TransportType)
    : 'motor';

  const travelStyle = VALID_TRAVEL_STYLES.has(rawPrefs.travelStyle as TravelStyle)
    ? (rawPrefs.travelStyle as TravelStyle)
    : 'santai';

  const startLocation =
    typeof rawPrefs.startLocation === 'string' && rawPrefs.startLocation.length > 0
      ? rawPrefs.startLocation
      : 'Surabaya';

  // Validasi conversationalReply
  const conversationalReply =
    typeof data.conversationalReply === 'string' && data.conversationalReply.length > 0
      ? data.conversationalReply
      : 'Bisa ceritakan lebih lanjut tentang rencana perjalananmu di Gresik?';

  // Validasi quickChoices
  const rawChoices = Array.isArray(data.quickChoices) ? data.quickChoices : [];
  const quickChoices = rawChoices
    .filter((c): c is string => typeof c === 'string' && c.length > 0)
    .slice(0, 4);

  // Validasi missingParameters
  const rawMissing = Array.isArray(data.missingParameters) ? data.missingParameters : [];
  const missingParameters = rawMissing.filter((p): p is string => typeof p === 'string');

  return {
    intent,
    preferences: { budget, duration, interests, transport, travelStyle, startLocation },
    missingParameters,
    conversationalReply,
    quickChoices,
  };
}

/**
 * Ekstraksi preferensi cepat berbasis rule/regex lokal
 * Digunakan untuk auto-generate instan dari form Beranda atau offline fallback
 */
export function extractPreferencesLocally(text: string): AIExtractedPreferences {
  const lower = text.toLowerCase();

  // 1. Ekstraksi Budget
  let budget: number | null = null;
  const budgetMatch = lower.match(/(?:budget|anggaran|rp\.?|uang)?\s*(\d{1,4})\s*(k|rb|ribu)/i) ||
                      lower.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+)/i);
  if (budgetMatch) {
    if (budgetMatch[2]) {
      const val = parseInt(budgetMatch[1], 10);
      budget = val < 1000 ? val * 1000 : val;
    } else {
      budget = parseInt(budgetMatch[1].replace(/\./g, ''), 10);
    }
  } else if (lower.includes('100k') || lower.includes('100 ribu') || lower.includes('100rb')) {
    budget = 100000;
  } else if (lower.includes('150k') || lower.includes('150 ribu') || lower.includes('150rb')) {
    budget = 150000;
  } else if (lower.includes('200k') || lower.includes('200 ribu') || lower.includes('200rb')) {
    budget = 200000;
  } else if (lower.includes('hemat') || lower.includes('murah')) {
    budget = 100000;
  } else {
    budget = null;
  }

  // 2. Ekstraksi Minat (Strict Exclusivity Check)
  const interests: DestinationCategory[] = [];
  const isKulinerOnly = lower.includes('kuliner') || lower.includes('makan') || lower.includes('krawu') || lower.includes('pudak') || lower.includes('otak-otak');
  const isAlam = lower.includes('alam') || lower.includes('pantai') || lower.includes('bukit') || lower.includes('telaga') || lower.includes('healing');
  const isReligi = lower.includes('religi') || lower.includes('ziarah') || lower.includes('wali') || lower.includes('makam') || lower.includes('masjid');
  const isSejarah = lower.includes('sejarah') || lower.includes('heritage') || lower.includes('kota tua') || lower.includes('bandar') || lower.includes('kemasan');
  const isKeluarga = lower.includes('keluarga') || lower.includes('anak') || lower.includes('water') || lower.includes('wahana');
  const isEdukasi = lower.includes('edukasi') || lower.includes('lontar sewu') || lower.includes('mangrove');

  // Jika kata "saja" atau "hanya" disebut spesifik
  if (lower.includes('kulineran saja') || lower.includes('hanya kuliner') || lower.includes('kuliner saja') || lower.includes('makan saja')) {
    interests.push('kuliner');
  } else {
    if (isKulinerOnly) interests.push('kuliner');
    if (isAlam) interests.push('alam');
    if (isReligi) interests.push('religi');
    if (isSejarah) interests.push('sejarah');
    if (isKeluarga) interests.push('keluarga');
    if (isEdukasi) interests.push('edukasi');
  }

  // 3. Durasi
  let duration: TripDuration = '1_day';
  if (lower.includes('setengah hari') || lower.includes('half') || lower.includes('pagi saja') || lower.includes('sore saja')) {
    duration = 'half_day';
  } else if (lower.includes('2 hari') || lower.includes('dua hari') || lower.includes('menginap')) {
    duration = '2_days';
  }

  // 4. Transportasi
  let transport: TransportType = 'motor';
  if (lower.includes('mobil') || lower.includes('rombongan') || lower.includes('keluarga')) {
    transport = 'mobil';
  } else if (lower.includes('umum') || lower.includes('bus') || lower.includes('angkot')) {
    transport = 'umum';
  }

  // 5. Gaya
  const travelStyle: TravelStyle = lower.includes('padat') || lower.includes('banyak') ? 'padat' : 'santai';

  return {
    budget,
    duration,
    interests,
    transport,
    travelStyle,
    startLocation: lower.includes('gresik') ? 'Gresik' : 'Surabaya',
  };
}

/**
 * Parse dan validasi respons dari endpoint /api/ai/explain
 */
export function parseExplainResponse(raw: string): AIExplainResponse {
  const data = safeParse(raw) as Record<string, unknown>;

  const explanation =
    typeof data.explanation === 'string' && data.explanation.length > 0
      ? data.explanation
      : 'Destinasi ini dipilihkan sistem berdasarkan preferensi perjalananmu.';

  return { explanation };
}

/**
 * Parse dan validasi respons dari endpoint /api/ai/replan
 */
export function parseReplanResponse(raw: string): AIReplanResponse {
  const data = safeParse(raw) as Record<string, unknown>;

  const validActions = new Set([
    'reduce_budget', 'change_culinary', 'change_destination', 'make_relaxed', 'custom',
  ]);

  const replanAction = validActions.has(data.replanAction as string)
    ? (data.replanAction as AIReplanResponse['replanAction'])
    : 'custom';

  return {
    replanAction,
    newBudget:
      typeof data.newBudget === 'number' && data.newBudget > 0 ? data.newBudget : null,
    targetDestinationId:
      typeof data.targetDestinationId === 'string' ? data.targetDestinationId : null,
    targetCulinaryId:
      typeof data.targetCulinaryId === 'string' ? data.targetCulinaryId : null,
    naturalInstruction:
      typeof data.naturalInstruction === 'string' ? data.naturalInstruction : '',
    confirmationMessage:
      typeof data.confirmationMessage === 'string' && data.confirmationMessage.length > 0
        ? data.confirmationMessage
        : 'Baik, saya akan menyesuaikan rencana perjalananmu.',
  };
}

/**
 * Cek apakah preferensi cukup untuk menyusun rekomendasi.
 * Selama budget dan minat terisi, sistem siap menyajikan rekomendasi.
 */
export function isPreferencesComplete(prefs: AIExtractedPreferences): boolean {
  return (
    typeof prefs.budget === 'number' &&
    prefs.budget > 0 &&
    Array.isArray(prefs.interests) &&
    prefs.interests.length > 0
  );
}
