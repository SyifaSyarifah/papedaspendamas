'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CulinarySpot } from '../../types/destination';

interface FoodCardProps {
  food: CulinarySpot;
  isSelected?: boolean;
  onToggleSelect?: (food: CulinarySpot) => void;
}

export function FoodCard({ food, isSelected = false, onToggleSelect }: FoodCardProps) {
  return (
    <div
      className={`group flex flex-col bg-surface rounded-[20px] shadow-[0_10px_30px_rgba(37,37,37,0.05)] border transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(37,37,37,0.08)] ${
        isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-border'
      }`}
    >
      <div className="relative w-full aspect-video bg-surface-container-high overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3.5 left-3.5 bg-tertiary-container text-on-tertiary-container font-label-sm text-xs px-3 py-1 rounded-full shadow-xs font-bold">
          {food.categoryLabel}
        </div>

        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-surface text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <span className="material-symbols-outlined text-[14px] text-primary-fixed">location_on</span>
            <span className="line-clamp-1">{food.distanceFromItinerary || 'Gresik Kota'}</span>
          </div>
          <div className="font-bold bg-primary-container text-on-primary-fixed px-2.5 py-1 rounded-lg shadow-sm">
            {food.priceLabel}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="font-bold text-on-surface">{food.rating}</span>
            <span>•</span>
            <span>{food.openingHours}</span>
          </div>

          <h3 className="font-section-title text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
            {food.name}
          </h3>

          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-3">
            {food.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {food.popularMenu.map((menu, i) => (
              <span
                key={i}
                className="font-label-sm text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant border border-border"
              >
                {menu}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2.5 border-t border-border mt-auto">
          {onToggleSelect && (
            <button
              type="button"
              onClick={() => onToggleSelect(food)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-button-text text-xs sm:text-sm transition-all shadow-xs flex justify-center items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-semibold'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSelected ? 'check' : 'add'}
              </span>
              <span>{isSelected ? 'Terpilih' : 'Tambah'}</span>
            </button>
          )}

          <Link
            href={`/explore/food/${food.id}`}
            className="flex-1 bg-surface hover:bg-surface-container border border-outline-variant text-on-surface font-button-text text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-colors flex justify-center items-center"
          >
            Detail Kuliner
          </Link>
        </div>
      </div>
    </div>
  );
}

