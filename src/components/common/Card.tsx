import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-surface border border-border rounded-2xl shadow-soft',
    highlight: 'bg-primary-light border-2 border-primary/40 rounded-2xl shadow-card',
    flat: 'bg-surface border border-border rounded-2xl',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={twMerge(clsx(variantStyles[variant], paddingStyles[padding], className))}
      {...props}
    >
      {children}
    </div>
  );
}
