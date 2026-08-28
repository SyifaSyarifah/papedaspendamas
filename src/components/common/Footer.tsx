'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gatraLogo from '../../image/gatra_logo.webp';

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://gatra.vercel.app';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-10 pb-24 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-border/80">
          {/* Column 1: Brand & Keterangan Singkat */}
          <div className="md:col-span-6 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src={gatraLogo}
                alt="GATRA AI Travel Gresik"
                height={36}
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-md">
              Asisten cerdas perencanaan perjalanan wisata personal di Kabupaten Gresik berbasis AI.
            </p>
          </div>

          {/* Column 2: Navigasi Ringkas */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-section-title font-bold text-sm text-on-surface tracking-wider uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2 font-body-md text-sm">
              <li>
                <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/plan" className="text-on-surface-variant hover:text-primary transition-colors">
                  Buat Rencana
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
                  Eksplorasi Wisata
                </Link>
              </li>
              <li>
                <Link href="/my-trip" className="text-on-surface-variant hover:text-primary transition-colors">
                  Perjalanan Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Icon Share & Email (Tanpa Kotak/Border) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-section-title font-bold text-sm text-on-surface tracking-wider uppercase">
              Kontak
            </h4>
            <div className="flex items-center gap-4 pt-1">
              {/* Tombol Share / Salin Tautan */}
              <button
                type="button"
                onClick={handleCopyLink}
                title={copied ? 'Tautan tersalin!' : 'Bagikan / Salin link website'}
                className="relative p-1 text-on-surface-variant hover:text-primary transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                aria-label="Bagikan website"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {copied ? 'check' : 'share'}
                </span>
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-on-surface text-surface rounded shadow-md whitespace-nowrap animate-fade-in-up">
                    Tersalin!
                  </span>
                )}
              </button>

              {/* Tautan Kirim Email */}
              <a
                href="mailto:44human4@gmail.com"
                title="Kirim email ke 44human4@gmail.com"
                className="p-1 text-on-surface-variant hover:text-primary transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                aria-label="Kirim email"
              >
                <span className="material-symbols-outlined text-[22px]">mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary font-body-md">
          <p>© {new Date().getFullYear()} GATRA — AI Travel Planner Gresik. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="hover:text-primary transition-colors">
              Pariwisata Gresik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
