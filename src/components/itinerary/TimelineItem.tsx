'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TimelineSlot } from '../../types/itinerary';

interface TimelineItemProps {
  slot: TimelineSlot;
  isLast?: boolean;
}

export function TimelineItem({ slot, isLast = false }: TimelineItemProps) {
  const getIcon = () => {
    switch (slot.type) {
      case 'departure':
        return 'directions_car';
      case 'culinary':
        return 'restaurant';
      case 'return':
        return 'home';
      case 'destination':
      default:
        return 'museum';
    }
  };

  const getNodeColor = () => {
    switch (slot.type) {
      case 'departure':
        return 'bg-tertiary text-on-tertiary';
      case 'culinary':
        return 'bg-secondary text-on-secondary';
      case 'return':
        return 'bg-surface-container-highest text-on-surface-variant';
      case 'destination':
      default:
        return 'bg-primary text-on-primary';
    }
  };

  const imageSrc =
    slot.destinationData?.image ||
    slot.culinaryData?.image ||
    (slot.type === 'departure'
      ? 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80'
      : undefined);

  return (
    <div className="relative">
      {/* Node & Content Wrapper */}
      <div className="relative pl-10 sm:pl-12">
        {/* Circle Node Icon */}
        <div
          className={`absolute -left-5 top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-label-sm shadow-sm z-10 ${getNodeColor()}`}
        >
          <span className="material-symbols-outlined text-[20px]">{getIcon()}</span>
        </div>

        {/* Card Box */}
        <div className="bg-surface rounded-[20px] p-5 sm:p-6 shadow-sm border border-border flex flex-col gap-4 hover:border-primary/40 transition-all">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-xs text-text-secondary font-semibold">
                {slot.time} ({slot.durationMinutes} menit)
              </span>
              <h3 className="font-section-title text-base sm:text-lg font-bold text-on-surface">
                {slot.title}
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                {slot.description}
              </p>
            </div>

            <span className="font-label-sm text-xs bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-bold shrink-0">
              {slot.costLabel}
            </span>
          </div>

          {/* Image Thumbnail */}
          {imageSrc && (
            <div className="w-full h-32 sm:h-36 rounded-xl bg-surface-container overflow-hidden relative">
              <Image
                src={imageSrc}
                alt={slot.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Footer location & link */}
          {(slot.destinationData || slot.culinaryData) && (
            <div className="flex justify-between items-center text-xs text-text-secondary pt-3 border-t border-border">
              <span className="flex items-center gap-1 line-clamp-1 max-w-[65%]">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                <span>
                  {slot.destinationData?.address.split(',')[0] || slot.culinaryData?.address.split(',')[0]}
                </span>
              </span>

              {slot.destinationData && (
                <Link
                  href={`/explore/destination/${slot.destinationData.id}`}
                  className="text-primary font-bold flex items-center gap-0.5 hover:underline shrink-0"
                >
                  <span>Detail</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              )}

              {slot.culinaryData && (
                <Link
                  href={`/explore/food/${slot.culinaryData.id}`}
                  className="text-primary font-bold flex items-center gap-0.5 hover:underline shrink-0"
                >
                  <span>Menu</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transit Indicator connecting to next */}
      {!isLast && slot.travelTimeToNextMinutes && (
        <div className="my-5 pl-10 sm:pl-12 flex items-center">
          <div className="bg-surface-container-low border border-border/80 px-4 py-1.5 rounded-full font-label-sm text-xs text-text-secondary flex items-center gap-2 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-primary">directions_car</span>
            <span>
              ± {slot.travelTimeToNextMinutes} menit perjalanan ({slot.distanceToNextKm} km)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

