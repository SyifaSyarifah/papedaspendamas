'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { ReplanningDiff } from '../../../types/itinerary';

export default function ReplanPage() {
  const router = useRouter();
  const { activeItinerary, setReplanningDiff } = useTripPlanner();
  const [customText, setCustomText] = useState('');

  const currentTotal = activeItinerary?.budget.total || 125000;

  const handleActionCard = (type: 'budget' | 'culinary' | 'style') => {
    let diff: ReplanningDiff;

    if (type === 'culinary') {
      diff = {
        changeType: 'culinary',
        explanation:
          'Saya mengganti menu kuliner utama ke pilihan jajanan tradisional legendaris dengan harga lebih terjangkau.',
        beforeItem: {
          title: 'Nasi Krawu Daging Suwir Komplit',
          cost: 35000,
          description: 'Kuliner tradisional komplit dengan jeroan dan serundeng 3 warna.',
        },
        afterItem: {
          title: 'Pudak Daun Pinang & Jajanan Khas',
          cost: 25000,
          description: 'Kue khas Gresik bungkus ope pinang asli turun temurun.',
        },
        budgetBefore: currentTotal,
        budgetAfter: currentTotal - 10000,
        remainingBudget: 35000,
      };
    } else if (type === 'budget') {
      diff = {
        changeType: 'budget',
        explanation:
          'Saya memangkas aktivitas berbayar dan memilih destinasi cagar budaya gratis di pusat kota agar hemat anggaran.',
        beforeItem: {
          title: 'Wisata Alam Gosari (WAGOS)',
          cost: 15000,
          description: 'Ekowisata perbukitan kapur dan taman celosia.',
        },
        afterItem: {
          title: 'Kampung Kemasan Heritage (Bebas Tiket)',
          cost: 0,
          description: 'Wisata sejarah arsitektur rumah merah saudagar masa lampau.',
        },
        budgetBefore: currentTotal,
        budgetAfter: currentTotal - 25000,
        remainingBudget: 50000,
      };
    } else {
      diff = {
        changeType: 'style',
        explanation:
          'Saya mengurangi jumlah titik kunjungan agar durasi di setiap destinasi lebih leluasa dan santai.',
        beforeItem: {
          title: 'Jadwal 3 Destinasi Padat',
          cost: currentTotal,
          description: 'Waktu istirahat terbatas di sela perjalanan.',
        },
        afterItem: {
          title: 'Jadwal 2 Destinasi Santai + Kopi Giras',
          cost: currentTotal - 15000,
          description: 'Durasi kunjungan lebih panjang dengan waktu santai ngopi kothok.',
        },
        budgetBefore: currentTotal,
        budgetAfter: currentTotal - 15000,
        remainingBudget: 40000,
      };
    }

    setReplanningDiff(diff);
    router.push('/plan/replan-result');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    handleActionCard('culinary');
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
          onClick={() => handleActionCard('budget')}
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
          onClick={() => handleActionCard('culinary')}
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
          onClick={() => handleActionCard('style')}
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
            className="flex-1 px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-on-surface"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-on-primary font-button-text font-bold text-sm rounded-xl transition-all shadow-xs hover:bg-[#5e4700] flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <span>Kirim</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

