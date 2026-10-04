'use client';

/**
 * AIChatInterface.tsx — Task 2.3 & 2.4
 *
 * Perubahan dari versi sebelumnya:
 * - processUserQuery() diganti dengan panggilan fetch ke /api/ai/chat (Task 2.3)
 * - Menampilkan loading progress kontekstual: "Memahami preferensi... Mencari destinasi..."
 * - Fallback banner muncul jika API offline (Task 2.4)
 * - Preferensi yang diekstrak AI otomatis di-sync ke TripPlannerContext
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { ChatMessage, UserPreferences } from '../../types/planner';

// Tipe respons dari /api/ai/chat
interface ChatAPIResponse {
  extractedPreferences?: Partial<UserPreferences>;
  intent?: string;
  missingParameters?: string[];
  isComplete?: boolean;
  reply?: string;
  quickChoices?: string[];
  isOffline?: boolean;
  fallbackMessage?: string;
  error?: string;
}

// Label kontekstual untuk loading progress (PRD 02 Bab 38)
const LOADING_STAGES = [
  'Memahami preferensimu...',
  'Mencari destinasi terbaik...',
  'Menyusun rekomendasi...',
];

export function AIChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoTriggeredRef = useRef(false);
  const { preferences, updatePreferences, setIsGenerating } = useTripPlanner();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  // Task 2.4: state untuk menampilkan fallback banner jika AI offline
  const [isAIOffline, setIsAIOffline] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState('');

  const [chatExtractedPrefs, setChatExtractedPrefs] = useState<Record<string, unknown>>({});

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Halo! Saya GATRA AI. Ceritakan perjalanan yang kamu inginkan di Gresik, nanti saya bantu pilihkan destinasi, kuliner, dan susunkan jadwal perjalanan terbaik.',
      timestamp: '09:00',
      quickChoices: [
        'Saya punya budget 100 ribu untuk kulineran',
        'Wisata alam & pantai 1 hari',
        'Ziarah & wisata sejarah di Gresik',
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Referensi ke riwayat pesan untuk multi-turn context ke API
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const visualOptions = [
    {
      label: 'Wisata Alam',
      category: 'alam' as const,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Religi & Budaya',
      category: 'religi' as const,
      image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=400&q=80',
    },
    {
      label: 'Kuliner Legenda',
      category: 'kuliner' as const,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Animasi loading stage yang berganti-ganti saat isTyping = true
  useEffect(() => {
    if (!isTyping) {
      setLoadingStage(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isTyping]);

  /**
   * Task 2.3 — Panggilan fetch ke /api/ai/chat
   * HANYA mengirimkan preferensi yang benar-benar telah diisi oleh user dalam percakapan chat.
   */
  const callAIChat = async (query: string): Promise<ChatAPIResponse> => {
    // Sertakan riwayat percakapan untuk multi-turn context
    const historyForAPI = messagesRef.current.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    // Tambahkan pesan user terbaru ke riwayat
    historyForAPI.push({ sender: 'user', text: query });

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: historyForAPI,
        currentPreferences: Object.keys(chatExtractedPrefs).length > 0 ? chatExtractedPrefs : undefined,
      }),
      signal: AbortSignal.timeout(12000), // 12 detik timeout di sisi frontend
    });

    return response.json();
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    // Tambahkan pesan user ke chat
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setIsAIOffline(false); // Reset status offline setiap ada percakapan baru

    try {
      const data = await callAIChat(query);

      setIsTyping(false);

      // Task 2.4 — Jika API offline, tampilkan fallback banner
      if (data.isOffline) {
        setIsAIOffline(true);
        setOfflineMessage(
          data.fallbackMessage ||
            'GATRA AI sedang offline. Gunakan Quick Planner untuk menyusun perjalananmu.'
        );
        return; // Hentikan proses, jangan tambah pesan AI
      }

      // Sync preferensi yang diekstrak AI ke state percakapan & TripPlannerContext
      if (data.extractedPreferences) {
        const prefs = data.extractedPreferences;
        setChatExtractedPrefs((prev) => ({ ...prev, ...prefs }));
        const partialUpdate: Partial<UserPreferences> = {};

        if (typeof prefs.budget === 'number' && prefs.budget > 0) {
          partialUpdate.budget = prefs.budget;
        }
        if (prefs.duration != null) partialUpdate.duration = prefs.duration;
        if (prefs.transport != null) partialUpdate.transport = prefs.transport;
        if (prefs.travelStyle != null) partialUpdate.travelStyle = prefs.travelStyle;
        if (prefs.startLocation != null) partialUpdate.startLocation = prefs.startLocation;
        if (Array.isArray(prefs.interests) && prefs.interests.length > 0) {
          partialUpdate.interests = prefs.interests as UserPreferences['interests'];
        }
        partialUpdate.queryHint = query;

        if (Object.keys(partialUpdate).length > 0) {
          updatePreferences(partialUpdate);
        }
      }

      // Tambahkan respons AI ke chat
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text:
          data.reply ||
          'Ceritakan lebih lanjut tentang rencana perjalananmu di Gresik!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        quickChoices: data.quickChoices ?? [],
      };

      setMessages((prev) => [...prev, aiReply]);

    } catch {
      setIsTyping(false);
      // Task 2.4 — Error fetch (timeout, jaringan terputus, dll)
      setIsAIOffline(true);
      setOfflineMessage(
        'GATRA AI sedang offline karena koneksi internet terputus. Kamu tetap bisa menyusun itinerary lewat Quick Planner!'
      );
    }
  };

  // Revisi 5: Auto-trigger pesan jika pengguna mengetik rencana dari beranda (?q=...)
  useEffect(() => {
    const rawQuery = searchParams.get('q');
    if (rawQuery && rawQuery.trim() && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      // Bersihkan tanda kutip pembungkus jika ada
      const cleanQuery = rawQuery.trim().replace(/^["']|["']$/g, '');
      if (cleanQuery) {
        handleSend(cleanQuery);
      }
    }
  }, [searchParams]);

  const handleQuickChoiceClick = (choice: string) => {
    if (choice.includes('Rekomendasi') || choice.includes('Lihat Rekomendasi')) {
      setIsGenerating(true);
      router.push('/plan/recommendation');
      return;
    }
    handleSend(choice);
  };

  const handleVisualSelect = (opt: (typeof visualOptions)[0]) => {
    updatePreferences({ interests: [opt.category] });
    handleSend(`Saya tertarik dengan wisata ${opt.label}`);
  };

  // Task 2.4 — Handle klik tombol fallback ke Quick Planner
  const handleGoToQuickPlanner = () => {
    router.push('/plan?mode=quick');
  };

  return (
    <div className="max-w-[800px] mx-auto bg-surface rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border flex flex-col overflow-hidden h-[700px]">
      {/* Header inside Container */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border shrink-0 bg-surface">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-xs">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-section-title text-base sm:text-lg font-bold text-on-surface m-0">
                GATRA AI
              </h2>
              {/* Indikator status: hijau = online, abu = offline */}
              <div
                className={`w-2 h-2 rounded-full ${
                  isAIOffline
                    ? 'bg-gray-400'
                    : 'bg-[#4CAF50] animate-pulse'
                }`}
              />
            </div>
            <div className="font-label-sm text-xs text-text-secondary mt-0.5">
              {isAIOffline ? 'Sedang Offline' : 'Asisten Perjalanan Lokal'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages(initialMessages);
            setChatExtractedPrefs({});
            setIsAIOffline(false);
          }}
          className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          title="Reset obrolan"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>

      {/* Task 2.4 — Fallback Banner (muncul jika AI offline) */}
      {isAIOffline && (
        <div className="mx-4 mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shrink-0">
          <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">
            wifi_off
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 mb-0.5">GATRA AI Sedang Offline</p>
            <p className="text-xs text-amber-700 leading-relaxed">{offlineMessage}</p>
          </div>
          <button
            type="button"
            onClick={handleGoToQuickPlanner}
            className="shrink-0 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
          >
            Quick Planner
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 bg-surface-container-lowest" id="chat-container">
        {/* Date separator */}
        <div className="flex justify-center my-1">
          <span className="bg-surface-container-low px-4 py-1 rounded-full font-label-sm text-xs text-text-secondary">
            Hari ini
          </span>
        </div>

        {/* Visual Selection Carousel as first suggestion */}
        <div className="bg-surface-container-low/70 border border-border/80 rounded-2xl p-4 space-y-2.5">
          <span className="font-label-sm text-xs text-on-surface-variant font-semibold">
            Inspirasi gaya perjalanan:
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {visualOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleVisualSelect(opt)}
                disabled={isTyping}
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-primary transition-all active:scale-95 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className="w-full h-14 rounded-lg bg-cover bg-center group-hover:scale-102 transition-transform"
                  style={{ backgroundImage: `url(${opt.image})` }}
                />
                <span className="font-label-sm text-xs text-on-surface font-medium text-center truncate w-full">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div key={msg.id} className="flex flex-col gap-1 animate-fade-in-up">
              <div
                className={`font-label-sm text-xs text-text-secondary mb-1 ${
                  isAi ? 'ml-14' : 'mr-14 text-right'
                }`}
              >
                {isAi ? 'GATRA' : 'Kamu'}
              </div>

              <div className={`flex items-start gap-3.5 ${isAi ? 'justify-start' : 'justify-end'}`}>
                {isAi && (
                  <div className="w-10 h-10 rounded-full bg-primary-container shrink-0 flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      auto_awesome
                    </span>
                  </div>
                )}

                <div
                  className={`px-5 py-4 rounded-[20px] max-w-[82%] shadow-sm ${
                    isAi
                      ? 'bg-warning-soft rounded-tl-xs border border-primary-container/30 text-on-surface'
                      : 'bg-surface rounded-br-xs border border-border text-on-surface'
                  }`}
                >
                  <p className="font-body-md text-sm sm:text-base leading-relaxed m-0">
                    {msg.text}
                  </p>
                  <div className="text-right mt-1.5">
                    <span className="text-[11px] text-text-secondary opacity-70">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {!isAi && (
                  <div className="w-10 h-10 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center border border-border text-on-surface-variant font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                )}
              </div>

              {/* Quick Choice Buttons */}
              {isAi && msg.quickChoices && msg.quickChoices.length > 0 && (
                <div className="flex flex-wrap gap-2.5 ml-14 mt-3">
                  {msg.quickChoices.map((choice, i) => {
                    const isRecommendation = choice.includes('Rekomendasi') || choice.includes('Lihat Rekomendasi');
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickChoiceClick(choice)}
                        disabled={isTyping}
                        className={`px-4 py-2 rounded-full font-button-text text-xs sm:text-sm transition-all shadow-xs flex items-center gap-1.5 active:scale-95 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                          isRecommendation
                            ? 'bg-primary-container text-on-primary-container border-2 border-primary font-bold shadow-md hover:bg-primary hover:text-on-primary'
                            : 'border border-border bg-surface text-on-surface-variant hover:border-primary hover:text-primary hover:bg-warning-soft/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          {isRecommendation ? 'auto_awesome' : 'schedule'}
                        </span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading indicator dengan label kontekstual (PRD 02 Bab 38) */}
        {isTyping && (
          <div className="flex flex-col gap-1">
            <div className="ml-14 font-label-sm text-xs text-text-secondary mb-1">GATRA</div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-sm">auto_awesome</span>
              </div>
              <div className="bg-warning-soft px-4 py-3 rounded-[20px] rounded-tl-xs shadow-sm flex flex-col gap-1.5 min-w-[180px]">
                <div className="flex gap-1.5 items-center h-[24px]">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-text-secondary animate-pulse">
                  {LOADING_STAGES[loadingStage]}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-surface shrink-0 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <button
            type="button"
            className="absolute left-3.5 p-1 text-text-secondary hover:text-on-surface transition-colors flex items-center justify-center"
            title="Tambah preferensi"
          >
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAIOffline ? 'AI offline — gunakan Quick Planner' : 'Ketik preferensi atau pesan...'}
            disabled={isTyping}
            className="w-full bg-surface border border-border rounded-full py-3.5 pl-12 pr-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all font-body-md text-sm sm:text-base text-on-surface placeholder:text-text-secondary/60 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-primary-container text-on-primary-container rounded-full hover:bg-primary hover:text-on-primary transition-colors shadow-xs flex items-center justify-center disabled:opacity-40 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {input.trim() ? 'send' : 'mic'}
            </span>
          </button>
        </form>

        <div className="text-center mt-2.5">
          <span className="font-label-sm text-[12px] text-text-secondary">
            GATRA AI mengkalkulasi rekomendasi terbaik berdasarkan profil wisatamu.
          </span>
        </div>
      </div>
    </div>
  );
}
