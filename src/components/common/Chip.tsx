import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Chip({
  label,
  selected = false,
  onClick,
  icon,
  size = 'md',
  className,
}: ChipProps) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-label-sm gap-1.5',
    md: 'px-4 py-2 text-sm font-label-sm gap-2',
    lg: 'px-6 py-2.5 text-base font-button-text gap-2',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer select-none active:scale-95',
          sizeStyles[size],
          selected
            ? 'bg-primary text-on-primary border-primary shadow-sm font-bold'
            : 'bg-surface text-on-surface-variant border-border hover:border-primary/50 hover:bg-surface-container',
          className
        )
      )}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

