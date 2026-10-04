import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'outline' | 'tertiary';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-container text-on-primary-container border-transparent font-semibold',
    success: 'bg-success-soft text-success-dark border-transparent font-semibold',
    warning: 'bg-warning-soft text-on-surface border-transparent font-medium',
    tertiary: 'bg-tertiary-container text-on-tertiary-container border-transparent font-semibold',
    neutral: 'bg-surface-container-low text-on-surface-variant border-border font-medium',
    outline: 'bg-transparent text-on-surface-variant border-border font-medium',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs sm:text-sm gap-1.5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full border font-label-sm shadow-xs',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
    >
      {icon}
      {children}
    </span>
  );
}

