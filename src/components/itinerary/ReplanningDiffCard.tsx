'use client';

import React from 'react';
import { ReplanningDiff } from '../../types/itinerary';

interface ReplanningDiffCardProps {
  diff: ReplanningDiff;
  onApply: () => void;
  onCancel: () => void;
}

export function ReplanningDiffCard({ diff, onApply, onCancel }: ReplanningDiffCardProps) {
  const savings = diff.budgetBefore - diff.budgetAfter;

  return (
    <div className="max-w-xl mx-auto bg-surface rounded-[2.5rem] border border-border shadow-sm p-6 sm:p-8 space-y-6">
      {/* AI Header */}
      <div className="flex items-start gap-3 bg-warning-soft p-4 rounded-2xl border border-primary-container/40">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs shrink-0">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div>
          <h3 className="font-section-title font-bold text-on-surface text-sm sm:text-base mb-0.5">
            Rekomendasi Penyesuaian GATRA
          </h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {diff.explanation}
          </p>
        </div>
      </div>

      {/* Before / After Comparison */}
      <div className="space-y-4">
        {/* Before */}
        <div className="bg-surface-container-low p-4 rounded-2xl border border-border">
          <div className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Sebelumnya
          </div>
          <div className="flex justify-between items-center gap-2">
            <div>
              <div className="font-section-title font-bold text-on-surface text-sm sm:text-base">
                {diff.beforeItem.title}
              </div>
              <div className="font-body-md text-xs text-on-surface-variant">
                {diff.beforeItem.description}
              </div>
            </div>
            <div className="font-button-text text-sm font-semibold text-on-surface-variant shrink-0">
              Rp{diff.beforeItem.cost.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Change arrow */}
        <div className="flex justify-center -my-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs z-10">
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </div>
        </div>

        {/* After */}
        <div className="bg-warning-soft/70 p-4 rounded-2xl border-2 border-primary">
          <div className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            Diperbarui Menjadi
          </div>
          <div className="flex justify-between items-center gap-2">
            <div>
              <div className="font-section-title font-bold text-on-surface text-sm sm:text-base">
                {diff.afterItem.title}
              </div>
              <div className="font-body-md text-xs text-on-surface-variant">
                {diff.afterItem.description}
              </div>
            </div>
            <div className="font-section-title text-sm font-bold text-primary shrink-0">
              Rp{diff.afterItem.cost.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Summary Diff */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-border space-y-2 text-sm">
        <div className="flex justify-between text-on-surface-variant font-body-md text-xs sm:text-sm">
          <span>Estimasi biaya sebelumnya</span>
          <span className="line-through">
            Rp{diff.budgetBefore.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between font-section-title font-bold text-on-surface">
          <span>Estimasi biaya sekarang</span>
          <span className="text-base text-primary">
            Rp{diff.budgetAfter.toLocaleString('id-ID')}
          </span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between font-label-sm text-xs font-bold text-success-dark pt-2 border-t border-border">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              <span>Penghematan Anggaran</span>
            </span>
            <span>+ Rp{savings.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="sm:w-1/3 order-2 sm:order-1 py-3 px-4 rounded-xl border border-border hover:border-primary/50 bg-surface text-on-surface-variant font-button-text text-sm font-semibold transition-colors"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={onApply}
          className="sm:w-2/3 order-1 sm:order-2 py-3 px-6 rounded-xl bg-primary text-on-primary hover:bg-[#5e4700] font-button-text text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>Terapkan Perubahan</span>
        </button>
      </div>
    </div>
  );
}

