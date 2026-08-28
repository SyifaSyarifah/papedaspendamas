'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gatraLogo from '../../image/gatra_logo.webp';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-border/80">
          {/* Column 1: Brand & Info (Spans 4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src={gatraLogo}
                alt="GATRA AI Travel Gresik"
                height={38}
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-sm">
              Asisten perjalanan pintar berbasis AI yang dirancang untuk memudahkan eksplorasi destinasi wisata, cagar budaya, religi, dan kuliner legendaris di Kabupaten Gresik.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/20 text-on-surface font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span>AI-Powered Travel Concierge</span>
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-section-title font-bold text-sm text-on-surface tracking-wider uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2.5 font-body-md text-sm">
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
                <Link href="/plan?mode=ai" className="text-on-surface-variant hover:text-primary transition-colors">
                  Chat GATRA AI
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
                  Katalog Wisata
                </Link>
              </li>
              <li>
                <Link href="/my-trip" className="text-on-surface-variant hover:text-primary transition-colors">
                  Perjalanan Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Destinasi & Eksplorasi (Spans 3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-section-title font-bold text-sm text-on-surface tracking-wider uppercase">
              Kategori Wisata
            </h4>
            <ul className="space-y-2.5 font-body-md text-sm">
              <li>
                <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
                  Sejarah & Bandar Grissee
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
                  Wisata Religi & Ziarah
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
                  Alam & Pesisir Pantai
                </Link>
              </li>
              <li>
                <Link href="/explore?tab=culinary" className="text-on-surface-variant hover:text-primary transition-colors">
                  Kuliner & UMKM Khas
                </Link>
              </li>
              <li>
                <Link href="/plan/map" className="text-on-surface-variant hover:text-primary transition-colors">
                  Peta Rute Interaktif
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Bantuan (Spans 3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-section-title font-bold text-sm text-on-surface tracking-wider uppercase">
              Kontak & Dukungan
            </h4>
            <ul className="space-y-3 font-body-md text-sm text-on-surface-variant">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  mail
                </span>
                <a
                  href="mailto:halo@gatra-gresik.id"
                  className="hover:text-primary transition-colors break-all"
                >
                  halo@gatra-gresik.id
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  location_on
                </span>
                <span>Kabupaten Gresik, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                  schedule
                </span>
                <span>Layanan AI Online 24 Jam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-body-md">
          <p>© {new Date().getFullYear()} GATRA — AI Travel Planner Gresik. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="hover:text-primary transition-colors">
              Pariwisata Gresik
            </Link>
            <span>•</span>
            <Link href="/profile" className="hover:text-primary transition-colors">
              Pengaturan Akun
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
