'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { handleReplan } from '../../../lib/replanningEngine';

export default function ReplanPage() {
  const router = useRouter();
  const { activeItinerary, setReplanningDiff } = useTripPlanner();
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleActionCard = (type: 'reduce_budget' | 'change_culinary' | 'make_relaxed' | 'custom', targetId?: string) => {
    if (!activeItinerary) return;
    
    // Panggil fungsi replanning engine
    const { diff } = handleReplan(activeItinerary, type, targetId);

    setReplanningDiff(diff);
    router.push('/plan/replan-result');
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || isLoading || !activeItinerary) return;

    setIsLoading(true);
    try {
      // Panggil AI untuk extract intent
      const res = await fetch('/api/ai/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: customText,
          currentItinerarySummary: `Budget: ${activeItinerary.budget.total}. Destinasi: ${activeItinerary.selectedDestinations.map(d => d.name).join(', ')}`
        })
      });
      const data = await res.json();
      
      const action = data.replanAction || 'custom';
      handleActionCard(action, data.targetCulinaryId || data.targetDestinationId);
    } catch (err) {
      console.error(err);
      handleActionCard('custom'); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/plan/itinerary"
          className="inline-flex items-center gap-1.5 font-label-sm text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Kembali ke Jadwal</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Sesuaikan Jadwal</span>
        </div>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
          Sesuaikan Perjalananmu
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant">
          Ada bagian jadwal atau destinasi yang ingin kamu ubah? Pilih penyesuaian cepat di bawah.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Kurangi Budget */}
        <button
          type="button"
          onClick={() => handleActionCard('reduce_budget')}
          className="bg-surface p-6 rounded-[24px] border border-border shadow-xs hover:border-primary hover:shadow-sm transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <h3 className="font-section-title font-bold text-base text-on-surface mb-1">
            Kurangi Budget
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Cari alternatif destinasi bebas tiket masuk & kuliner hemat.
          </p>
        </button>

        {/* 2. Ganti Kuliner */}
        <button
          type="button"
          onClick={() => handleActionCard('change_culinary')}
          className="bg-surface p-6 rounded-[24px] border border-border shadow-xs hover:border-primary hover:shadow-sm transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <span className="material-symbols-outlined text-2xl">restaurant</span>
          </div>
          <h3 className="font-section-title font-bold text-base text-on-surface mb-1">
            Ganti Tempat Kuliner
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Ganti menu makan ke oleh-oleh Pudak atau olahan bandeng pesisir.
          </p>
        </button>

        {/* 3. Buat Lebih Santai */}
        <button
          type="button"
          onClick={() => handleActionCard('make_relaxed')}
          className="bg-surface p-6 rounded-[24px] border border-border shadow-xs hover:border-primary hover:shadow-sm transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <span className="material-symbols-outlined text-2xl">coffee</span>
          </div>
          <h3 className="font-section-title font-bold text-base text-on-surface mb-1">
            Buat Lebih Santai
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Kurangi kepadatan tempat agar punya lebih banyak waktu santai.
          </p>
        </button>

        {/* 4. Chat Perubahan Bebas */}
        <Link
          href="/plan?mode=ai"
          className="bg-warning-soft p-6 rounded-[24px] border border-primary-container shadow-xs hover:shadow-sm transition-all text-left group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h3 className="font-section-title font-bold text-base text-on-surface mb-1">
              Diskusi dengan AI
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant">
              Ceritakan perubahan apa saja secara natural dengan GATRA AI.
            </p>
          </div>
        </Link>
      </div>

      {/* Free-text prompt input */}
      <div className="bg-surface p-6 rounded-[24px] border border-border shadow-xs space-y-3">
        <label className="font-section-title text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
          <span>Atau ceritakan perubahan yang kamu inginkan:</span>
        </label>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Misal: Saya ingin lebih banyak waktu untuk beli oleh-oleh..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-on-surface disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-on-primary font-button-text font-bold text-sm rounded-xl transition-all shadow-xs hover:bg-[#5e4700] flex items-center gap-1.5 active:scale-95 shrink-0 disabled:opacity-50"
          >
            <span>{isLoading ? 'Memproses...' : 'Kirim'}</span>
            {!isLoading && <span className="material-symbols-outlined text-[18px]">send</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

