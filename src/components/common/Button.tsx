import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-button-text rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-8 py-3.5 text-base font-semibold gap-2.5 shadow-sm',
  };

  const variantStyles = {
    primary:
      'bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-semibold shadow-sm transition-colors',
    gold:
      'bg-primary text-on-primary hover:bg-[#5e4700] shadow-md hover:shadow-xl hover:-translate-y-0.5',
    secondary:
      'bg-secondary-container hover:bg-[#dfd39f] text-on-secondary-container font-semibold',
    outline:
      'border border-border hover:border-primary/50 bg-surface text-on-surface hover:bg-surface-container/50',
    ghost:
      'hover:bg-surface-container text-on-surface hover:text-primary',
    danger:
      'bg-error-soft text-error hover:bg-[#ffd0d0]',
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

