import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12 max-w-lg mx-auto space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-primary-container/30 border border-primary/20 flex items-center justify-center text-on-primary-container shadow-sm">
        <span className="material-symbols-outlined text-4xl text-primary">explore_off</span>
      </div>

      <div className="space-y-2">
        <span className="font-label-sm text-xs font-bold uppercase tracking-widest text-primary">
          Error 404
        </span>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
          Halaman Tidak Ditemukan
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
          Destinasi atau halaman yang kamu cari tidak tersedia atau sedang dalam pembaruan rute.
        </p>
      </div>

      <Link href="/">
        <button className="px-6 py-3 bg-primary text-on-primary hover:bg-[#5e4700] font-button-text font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Kembali ke Beranda</span>
        </button>
      </Link>
    </div>
  );
}
