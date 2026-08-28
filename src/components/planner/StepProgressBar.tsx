import React from 'react';

interface StepProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  const steps = [
    { number: 1, title: 'Preferensi' },
    { number: 2, title: 'Rekomendasi' },
    { number: 3, title: 'Itinerary' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 text-label-sm font-label-sm mb-8">
      {steps.map((step, index) => {
        const isCurrent = currentStep === step.number;
        const isDone = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            {index > 0 && (
              <div
                className={`w-6 sm:w-10 h-0.5 transition-colors duration-300 ${
                  currentStep >= step.number ? 'bg-primary-container' : 'bg-surface-variant'
                }`}
              />
            )}

            <div
              className={`flex items-center gap-2 transition-colors duration-200 ${
                isCurrent || isDone
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant opacity-70'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary-container shadow-xs scale-105'
                    : isDone
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                ) : (
                  step.number
                )}
              </div>
              <span className="hidden sm:inline font-label-sm text-sm">
                {step.title}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

