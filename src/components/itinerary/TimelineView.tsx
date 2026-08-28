import React from 'react';
import { TimelineSlot } from '../../types/itinerary';
import { TimelineItem } from './TimelineItem';

interface TimelineViewProps {
  timeline: TimelineSlot[];
}

export function TimelineView({ timeline }: TimelineViewProps) {
  return (
    <div className="py-2">
      {timeline.map((slot, index) => (
        <TimelineItem
          key={slot.id}
          slot={slot}
          isLast={index === timeline.length - 1}
        />
      ))}
    </div>
  );
}
