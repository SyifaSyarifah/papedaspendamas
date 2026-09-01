'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { StepProgressBar } from '../../components/planner/StepProgressBar';
import { QuickPlannerForm } from '../../components/planner/QuickPlannerForm';
import { AIChatInterface } from '../../components/planner/AIChatInterface';

function PlanContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'ai' ? 'ai' : 'quick';
  const [plannerMode, setPlannerMode] = useState<'quick' | 'ai'>(initialMode);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'ai') {
      setPlannerMode('ai');
    } else if (modeParam === 'quick') {
      setPlannerMode('quick');
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Step 1 Progress */}
      <StepProgressBar currentStep={1} />

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#F0ECE1] border border-border">
          <button
            type="button"
            onClick={() => setPlannerMode('quick')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              plannerMode === 'quick'
                ? 'bg-surface text-text-primary shadow-soft'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B8870A]" />
            <span>Atur Preferensi</span>
          </button>

          <button
            type="button"
            onClick={() => setPlannerMode('ai')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              plannerMode === 'ai'
                ? 'bg-surface text-text-primary shadow-soft'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-4 h-4 fill-primary text-[#B8870A]" />
            <span>Chat dengan GATRA AI</span>
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          {plannerMode === 'quick' ? 'Yuk, Buat Perjalananmu' : 'Tanya & Susun Bersama GATRA AI'}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">
          {plannerMode === 'quick'
            ? 'Pilih preferensi perjalananmu di bawah untuk mendapatkan rekomendasi terbaik.'
            : 'Ceritakan gayamu dengan bahasa bebas, AI akan mengekstrak kebutuhanmu.'}
        </p>
      </div>

      {/* Main Content Area */}
      {plannerMode === 'quick' ? <QuickPlannerForm /> : <AIChatInterface />}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PlanContent />
    </Suspense>
  );
}
