/**
 * src/app/api/ai/explain/route.ts
 * Endpoint: POST /api/ai/explain
 *
 * Fungsi: Mengubah kode alasan mesin rekomendasi menjadi narasi
 * kalimat persuasif yang ramah untuk kartu rekomendasi destinasi.
 *
 * Sesuai PRD 02 Bab 9 & 36 — "Explainable AI"
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '../../../../lib/ai/groqClient';
import { EXPLAIN_SYSTEM_PROMPT } from '../../../../lib/ai/prompts';
import { parseExplainResponse } from '../../../../lib/ai/parser';

export const runtime = 'nodejs';

interface ExplainRequestBody {
  destinationName: string;
  matchScore: number;
  /** Array kode alasan dari engine rekomendasi */
  reasons: string[];
  /** Informasi tambahan opsional untuk konteks */
  priceLabel?: string;
  category?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExplainRequestBody = await req.json();

    if (!body.destinationName || !body.reasons || body.reasons.length === 0) {
      return NextResponse.json(
        { error: 'Field "destinationName" dan "reasons" wajib diisi.' },
        { status: 400 }
      );
    }

    const userContent = JSON.stringify({
      destinationName: body.destinationName,
      matchScore: body.matchScore,
      reasons: body.reasons,
      priceLabel: body.priceLabel,
      category: body.category,
    });

    const result = await callGroq({
      messages: [
        { role: 'system', content: EXPLAIN_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      temperature: 0.4, // Sedikit lebih kreatif untuk narasi yang natural
      max_tokens: 200,
    });

    const parsed = parseExplainResponse(result.content);

    return NextResponse.json({
      explanation: parsed.explanation,
      _meta: { model: result.model, tokens: result.usage.total_tokens },
    });
  } catch (err) {
    const error = err as Error;
    console.error('[/api/ai/explain] Error:', error.message);

    // Fallback: kembalikan penjelasan template sederhana
    return NextResponse.json({
      explanation:
        'Destinasi ini dipilihkan berdasarkan minat, budget, dan jarak yang sesuai profilmu.',
      isOffline: true,
    });
  }
}
