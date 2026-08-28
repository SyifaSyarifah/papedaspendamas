'use client';

import React from 'react';
import { BudgetBreakdown } from '../../types/itinerary';

interface BudgetSummaryCardProps {
  budget: BudgetBreakdown;
}

export function BudgetSummaryCard({ budget }: BudgetSummaryCardProps) {
  const total = Math.max(1, budget.total);
  const cap = Math.max(1, budget.budgetCap);

  const transportPct = (budget.transport / cap) * 100;
  const ticketsPct = (budget.tickets / cap) * 100;
  const culinaryPct = (budget.culinary / cap) * 100;
  const activityPct = (budget.activity / cap) * 100;

  return (
    <div className="bg-surface rounded-[24px] p-6 shadow-sm border border-border flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-section-title text-lg font-bold text-on-surface">
          Rincian Biaya (Budget)
        </h3>
        <span
          className={`font-label-sm text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
            budget.remaining >= 0
              ? 'bg-success-soft text-success-dark'
              : 'bg-error-soft text-error'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {budget.remaining >= 0 ? 'check_circle' : 'warning'}
          </span>
          <span>{budget.remaining >= 0 ? 'Under Budget' : 'Over Budget'}</span>
        </span>
      </div>

      {/* Multi-segmented Fuel Gauge Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-surface-container-low h-3.5 rounded-full overflow-hidden flex shadow-inner">
          <div
            className="bg-tertiary h-full transition-all duration-500"
            style={{ width: `${transportPct}%` }}
            title={`Transportasi: Rp${budget.transport.toLocaleString('id-ID')}`}
          />
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${ticketsPct}%` }}
            title={`Tiket: Rp${budget.tickets.toLocaleString('id-ID')}`}
          />
          <div
            className="bg-secondary h-full transition-all duration-500"
            style={{ width: `${culinaryPct}%` }}
            title={`Kuliner: Rp${budget.culinary.toLocaleString('id-ID')}`}
          />
          <div
            className="bg-primary-container h-full transition-all duration-500"
            style={{ width: `${activityPct}%` }}
            title={`Aktivitas/Parkir: Rp${budget.activity.toLocaleString('id-ID')}`}
          />
        </div>
        <div className="flex justify-between font-label-sm text-[11px] text-text-secondary">
          <span>0</span>
          <span>Batas: Rp{budget.budgetCap.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Breakdown Items with Color Dots */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center font-body-md text-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <div className="w-3 h-3 rounded-full bg-tertiary shrink-0" />
            <span>Transportasi & BBM</span>
          </div>
          <span className="text-on-surface font-semibold">
            Rp{budget.transport.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between items-center font-body-md text-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
            <span>Tiket Masuk Wisata</span>
          </div>
          <span className="text-on-surface font-semibold">
            Rp{budget.tickets.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between items-center font-body-md text-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <div className="w-3 h-3 rounded-full bg-secondary shrink-0" />
            <span>Kuliner & Makan</span>
          </div>
          <span className="text-on-surface font-semibold">
            Rp{budget.culinary.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between items-center font-body-md text-sm">
          <div className="flex items-center gap-2 text-on-surface">
            <div className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
            <span>Parkir, Infaq & Lainnya</span>
          </div>
          <span className="text-on-surface font-semibold">
            Rp{budget.activity.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-surface-variant" />

      {/* Totals & Sisa Budget */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-0.5">
          <span className="font-label-sm text-xs text-text-secondary">
            Sisa Budget (dari Rp{budget.budgetCap.toLocaleString('id-ID')})
          </span>
          <span className="font-section-title text-2xl font-bold text-success-dark">
            Rp{budget.remaining.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span className="font-label-sm text-xs text-text-secondary">Total Estimasi</span>
          <span className="font-section-title text-xl font-bold text-on-surface">
            Rp{budget.total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}

