'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface LoadingStateProps {
  onComplete?: () => void;
  title?: string;
  durationMs?: number;
}

const STEPS = [
  'Memahami preferensi & gaya perjalanan',
  'Mencari & menyaring destinasi terbaik di Gresik',
  'Menyusun jadwal waktu & rute optimal',
  'Menghitung estimasi budget & kuliner',
];

export function LoadingState({
  onComplete,
  title = 'GATRA sedang menyusun perjalanan...',
  durationMs = 2400,
}: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = durationMs / STEPS.length;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, stepInterval);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto bg-surface rounded-3xl border border-border shadow-float">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mb-6 text-text-primary animate-pulse-subtle shadow-soft">
        <Sparkles className="w-8 h-8 text-[#B8870A]" />
      </div>

      <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-8">
        Mengoptimalkan perjalananmu agar nyaman, hemat, dan berkesan.
      </p>

      <div className="w-full space-y-3.5 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-primary-light border border-primary/40 font-semibold text-text-primary'
                  : isDone
                  ? 'text-text-primary'
                  : 'text-text-muted opacity-50'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-text-primary animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />
              )}
              <span className="text-sm">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
