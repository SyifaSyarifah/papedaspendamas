'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../context/TripPlannerContext';

export default function MyTripPage() {
  const router = useRouter();
  const { savedTrips, setActiveItinerary, deleteSavedTrip, duplicateSavedTrip } = useTripPlanner();

  const handleOpenTrip = (trip: any) => {
    setActiveItinerary(trip);
    router.push('/plan/itinerary');
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">travel</span>
            <span>Manajemen Rencana Perjalanan</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-4xl font-bold text-on-surface">
            Perjalanan Saya
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Daftar jadwal perjalanan yang telah kamu simpan dan rencanakan di Gresik.
          </p>
        </div>

        <Link href="/plan">
          <button
            type="button"
            className="px-6 py-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-button-text font-bold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Buat Trip Baru</span>
          </button>
        </Link>
      </div>

      {/* Saved Trips List */}
      {savedTrips.length > 0 ? (
        <div className="space-y-4">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface rounded-[24px] border border-border p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-sm text-xs font-bold px-3 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container border border-primary/20">
                    {trip.preferences?.duration === 'half_day' ? 'Setengah Hari' : '1 Hari'}
                  </span>
                  <span className="font-label-sm text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span>{trip.createdAt}</span>
                  </span>
                </div>

                <h3 className="font-section-title text-lg sm:text-xl font-bold text-on-surface">
                  {trip.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 font-body-md text-xs sm:text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                    <span>{trip.selectedDestinations.length} Destinasi Wisata</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-on-surface">
                    Rp{trip.budget.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                <button
                  type="button"
                  onClick={() => duplicateSavedTrip(trip.id)}
                  className="p-2.5 rounded-xl border border-border text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
                  title="Duplikat Trip"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteSavedTrip(trip.id)}
                  className="p-2.5 rounded-xl border border-border text-error hover:bg-error-soft transition-all"
                  title="Hapus Trip"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenTrip(trip)}
                  className="flex-1 sm:flex-none py-2.5 px-5 bg-primary text-on-primary hover:bg-[#5e4700] font-button-text font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Buka Jadwal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface rounded-[24px] border border-border p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto text-on-primary-container">
            <span className="material-symbols-outlined text-3xl">bookmark</span>
          </div>
          <div>
            <h3 className="font-section-title text-lg font-bold text-on-surface mb-1">
              Belum Ada Perjalanan Tersimpan
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
              Kamu belum menyimpan rencana trip. Mulai buat rencana baru dengan AI atau Quick Form sekarang.
            </p>
          </div>
          <Link href="/plan">
            <button
              type="button"
              className="px-6 py-3 bg-primary text-on-primary font-button-text font-bold text-sm rounded-xl shadow-sm hover:bg-[#5e4700] transition-all flex items-center gap-2 mx-auto active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Mulai Rencanakan Trip</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

