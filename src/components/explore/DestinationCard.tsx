'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Destination } from '../../types/destination';

interface DestinationCardProps {
  destination: Destination;
  showMatchScore?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (dest: Destination) => void;
}

export function DestinationCard({
  destination,
  showMatchScore = false,
  isSelected = false,
  onToggleSelect,
}: DestinationCardProps) {
  const matchPercent = destination.matchScore || 90;

  return (
    <div
      className={`group flex flex-col bg-surface rounded-[20px] shadow-[0_10px_30px_rgba(37,37,37,0.05)] border transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(37,37,37,0.08)] ${
        isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-border'
      }`}
    >
      {/* Image Banner */}
      <div className="relative w-full aspect-video bg-surface-container-high overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Category Badge top left */}
        <div className="absolute top-3.5 left-3.5 bg-surface-container-low/90 backdrop-blur-md text-on-surface-variant font-label-sm text-xs px-3 py-1 rounded-full border border-border/50">
          {destination.categoryLabel}
        </div>

        {/* Match Score Badge top right */}
        {showMatchScore && (
          <div className="absolute top-3.5 right-3.5 bg-primary-container text-on-primary-container font-label-sm text-xs px-3 py-1 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-md bg-opacity-95 font-bold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{matchPercent}% Cocok</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col p-5 sm:p-6 gap-5 flex-grow justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-section-title text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
              {destination.name}
            </h3>
            <span className="font-label-sm text-xs text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded whitespace-nowrap">
              {destination.distanceKm} km
            </span>
          </div>

          <p className="font-body-md text-sm text-primary font-semibold">
            {destination.priceLabel}{' '}
            {destination.price > 0 && (
              <span className="text-text-secondary text-xs font-normal">/ orang</span>
            )}
          </p>

          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2">
            {destination.shortDescription}
          </p>

          {/* Mengapa Direkomendasikan */}
          {destination.matchReasons && destination.matchReasons.length > 0 && (
            <div className="flex flex-col gap-2 p-3.5 bg-background rounded-xl border border-border/70">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                Mengapa Direkomendasikan
              </span>
              <ul className="flex flex-col gap-1.5">
                {destination.matchReasons.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 font-body-md text-on-surface-variant text-[13px] leading-tight"
                  >
                    <span className="material-symbols-outlined text-[16px] bg-success-soft text-[#2e7d32] rounded-full p-[1px] shrink-0 mt-0.5">
                      check
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card Actions */}
        <div className="flex gap-2.5 pt-2 mt-auto">
          {onToggleSelect && (
            <button
              type="button"
              onClick={() => onToggleSelect(destination)}
              className={`flex-1 py-3 px-4 rounded-xl font-button-text text-sm transition-all shadow-xs flex justify-center items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSelected ? 'check' : 'add'}
              </span>
              <span>{isSelected ? 'Terpilih' : 'Tambah'}</span>
            </button>
          )}

          <Link
            href={`/explore/destination/${destination.id}`}
            className="flex-1 bg-surface hover:bg-surface-container border border-outline-variant text-on-surface font-button-text text-sm py-3 px-4 rounded-xl transition-colors flex justify-center items-center"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

