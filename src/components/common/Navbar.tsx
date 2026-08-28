'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gatraLogo from '../../image/gatra_logo.webp';

export function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar when near the very top of the page
      if (currentScrollY < 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Plan', href: '/plan' },
    { label: 'Explore', href: '/explore' },
    { label: 'My Trip', href: '/my-trip' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
    >
      <div className="h-20 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-auto flex items-center">
            <Image
              src={gatraLogo}
              alt="GATRA AI Travel Gresik"
              height={40}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <span className="hidden sm:inline-block text-[10px] text-text-secondary font-medium tracking-wider uppercase pl-1 border-l border-border/80">
            AI Travel Gresik
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-button-text text-button-text px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold bg-primary-container/15'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant flex items-center justify-center"
            title="Cari destinasi"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>

          <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

          <Link href="/plan" className="hidden sm:inline-flex">
            <button className="h-10 px-5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-button-text text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm active:scale-95">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Buat Trip</span>
            </button>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2.5 group p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-surface-container-high border border-border group-hover:border-primary flex items-center justify-center text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <span className="hidden lg:block font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-surface font-medium">
              Profil
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

