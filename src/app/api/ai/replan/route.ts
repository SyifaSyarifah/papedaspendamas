/**
 * src/app/api/ai/replan/route.ts
 * Endpoint: POST /api/ai/replan
 *
 * Fungsi: Menerima instruksi replanning bahasa natural dari user,
 * mengekstrak aksi replanning terstruktur, lalu sistem programatis
 * (bukan LLM) yang melakukan perubahan aktual pada itinerary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '../../../../lib/ai/groqClient';
import { REPLAN_SYSTEM_PROMPT } from '../../../../lib/ai/prompts';
import { parseReplanResponse } from '../../../../lib/ai/parser';

export const runtime = 'nodejs';

interface ReplanRequestBody {
  /** Instruksi perubahan bebas dari user, misalnya "Budget sisa 100 ribu, ganti makanan lebih murah" */
  instruction: string;
  /** Ringkasan itinerary aktif saat ini untuk konteks LLM */
  currentItinerarySummary?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ReplanRequestBody = await req.json();

    if (!body.instruction || body.instruction.trim().length === 0) {
      return NextResponse.json(
        { error: 'Field "instruction" wajib diisi.' },
        { status: 400 }
      );
    }

    const contextInfo = body.currentItinerarySummary
      ? `\nKonteks itinerary saat ini: ${body.currentItinerarySummary}`
      : '';

    const result = await callGroq({
      messages: [
        { role: 'system', content: REPLAN_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Instruksi perubahan: "${body.instruction}"${contextInfo}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
    });

    const parsed = parseReplanResponse(result.content);

    return NextResponse.json({
      replanAction: parsed.replanAction,
      newBudget: parsed.newBudget,
      targetDestinationId: parsed.targetDestinationId,
      targetCulinaryId: parsed.targetCulinaryId,
      confirmationMessage: parsed.confirmationMessage,
      _meta: { model: result.model, tokens: result.usage.total_tokens },
    });
  } catch (err) {
    const error = err as Error;
    console.error('[/api/ai/replan] Error:', error.message);

    // Fallback: kembalikan aksi default "custom" agar UI tetap jalan
    return NextResponse.json({
      replanAction: 'custom',
      newBudget: null,
      targetDestinationId: null,
      targetCulinaryId: null,
      confirmationMessage:
        'Permintaanmu sudah dicatat. Pilih salah satu opsi perubahan di bawah ini ya.',
      isOffline: true,
    });
  }
}
