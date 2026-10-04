'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, Edit3, Plus, Database, Landmark, Utensils } from 'lucide-react';
import { GRESIK_DESTINATIONS } from '../../data/gresikDestinations';
import { GRESIK_CULINARY } from '../../data/gresikCulinary';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'destinations' | 'culinary'>('destinations');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil</span>
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-greenSoft text-accent-green text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Verification & Source of Truth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Admin Data Management
            </h1>
            <p className="text-sm text-text-secondary">
              Memverifikasi akurasi data harga, koordinat GPS, dan jam operasional destinasi Gresik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Tambah Destinasi
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('destinations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'destinations'
              ? 'bg-primary text-text-primary shadow-soft'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Destinasi ({GRESIK_DESTINATIONS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('culinary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'culinary'
              ? 'bg-primary text-text-primary shadow-soft'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Kuliner & UMKM ({GRESIK_CULINARY.length})</span>
        </button>
      </div>

      {/* Table Data */}
      <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F3] border-b border-border text-xs uppercase font-bold text-text-secondary">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga / Tiket</th>
                <th className="p-4">Koordinat GPS</th>
                <th className="p-4">Jam Buka</th>
                <th className="p-4">Status Data</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {activeTab === 'destinations' ? (
                GRESIK_DESTINATIONS.map((dest) => (
                  <tr key={dest.id} className="hover:bg-[#FCFBF8] transition-colors">
                    <td className="p-4 font-bold text-text-primary">{dest.name}</td>
                    <td className="p-4">
                      <Badge variant="primary" size="sm">{dest.categoryLabel}</Badge>
                    </td>
                    <td className="p-4 font-semibold text-[#B8870A]">{dest.priceLabel}</td>
                    <td className="p-4 text-xs font-mono text-text-muted">
                      {dest.latitude}, {dest.longitude}
                    </td>
                    <td className="p-4 text-xs text-text-secondary">{dest.openingHours}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-green bg-accent-greenSoft px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terverifikasi
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                GRESIK_CULINARY.map((food) => (
                  <tr key={food.id} className="hover:bg-[#FCFBF8] transition-colors">
                    <td className="p-4 font-bold text-text-primary">{food.name}</td>
                    <td className="p-4">
                      <Badge variant="warning" size="sm">{food.categoryLabel}</Badge>
                    </td>
                    <td className="p-4 font-semibold text-[#B8870A]">{food.priceLabel}</td>
                    <td className="p-4 text-xs font-mono text-text-muted">
                      {food.latitude}, {food.longitude}
                    </td>
                    <td className="p-4 text-xs text-text-secondary">{food.openingHours}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-green bg-accent-greenSoft px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terverifikasi
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
