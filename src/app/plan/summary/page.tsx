'use client';

import React from 'react';
import { StepProgressBar } from '../../../components/planner/StepProgressBar';
import { PreferenceSummaryCard } from '../../../components/planner/PreferenceSummaryCard';

export default function SummaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <StepProgressBar currentStep={1} />
      <PreferenceSummaryCard />
    </div>
  );
}
