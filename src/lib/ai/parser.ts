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

  const budget =
    typeof rawPrefs.budget === 'number' && rawPrefs.budget > 0
      ? Math.round(rawPrefs.budget)
      : null;

  const duration = VALID_DURATIONS.has(rawPrefs.duration as TripDuration)
    ? (rawPrefs.duration as TripDuration)
    : null;

  const rawInterests = Array.isArray(rawPrefs.interests) ? rawPrefs.interests : [];
  const interests = rawInterests.filter((i): i is DestinationCategory =>
    VALID_INTERESTS.has(i as DestinationCategory)
  );

  const transport = VALID_TRANSPORTS.has(rawPrefs.transport as TransportType)
    ? (rawPrefs.transport as TransportType)
    : null;

  const travelStyle = VALID_TRAVEL_STYLES.has(rawPrefs.travelStyle as TravelStyle)
    ? (rawPrefs.travelStyle as TravelStyle)
    : null;

  const startLocation =
    typeof rawPrefs.startLocation === 'string' && rawPrefs.startLocation.length > 0
      ? rawPrefs.startLocation
      : null;

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
 * Cek apakah semua parameter utama sudah terisi (preferences complete).
 * Digunakan untuk memutuskan apakah bisa lanjut ke halaman rekomendasi.
 */
export function isPreferencesComplete(prefs: AIExtractedPreferences): boolean {
  return (
    prefs.budget !== null &&
    prefs.duration !== null &&
    prefs.interests.length > 0 &&
    prefs.transport !== null
  );
}
