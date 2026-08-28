'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Plan', href: '/plan', icon: 'edit_calendar' },
    { label: 'Explore', href: '/explore', icon: 'explore' },
    { label: 'My Trip', href: '/my-trip', icon: 'travel' },
    { label: 'Profile', href: '/profile', icon: 'person' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)] border-t border-border">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {items.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] transition-colors py-1 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

