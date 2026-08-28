'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { ReplanningDiffCard } from '../../../components/itinerary/ReplanningDiffCard';

export default function ReplanResultPage() {
  const router = useRouter();
  const { replanningDiff, applyReplanning } = useTripPlanner();

  const handleApply = () => {
    applyReplanning();
    router.push('/plan/itinerary');
  };

  const handleCancel = () => {
    router.push('/plan/replan');
  };

  // Fallback default diff if user navigates directly
  const diff = replanningDiff || {
    changeType: 'culinary',
    explanation: 'Saya mengganti destinasi kuliner dengan pilihan yang lebih hemat dan dekat dengan rute perjalananmu.',
    beforeItem: {
      title: 'Nasi Krawu Daging Suwir Komplit',
      cost: 35000,
      description: 'Kuliner tradisional komplit dengan suwiran daging sapi dan sambal terasi.',
    },
    afterItem: {
      title: 'Pudak Daun Pinang & Oleh-Oleh Khas',
      cost: 25000,
      description: 'Jajanan warisan khas Gresik dibungkus pelepah pinang asli.',
    },
    budgetBefore: 125000,
    budgetAfter: 115000,
    remainingBudget: 35000,
  };

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-6">
      <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
        <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
          Rencana Berhasil Disesuaikan
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant">
          Tinjau perbandingan sebelum dan sesudah perubahan sebelum menerapkannya ke jadwal.
        </p>
      </div>

      <ReplanningDiffCard
        diff={diff}
        onApply={handleApply}
        onCancel={handleCancel}
      />
    </div>
  );
}

