'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { ChatMessage } from '../../types/planner';

export function AIChatInterface() {
  const router = useRouter();
  const { preferences, updatePreferences } = useTripPlanner();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Halo! Saya GATRA. Ceritakan perjalanan yang kamu inginkan di Gresik, nanti saya bantu pilihkan destinasi, kuliner, dan susunkan itinerary terbaik.',
      timestamp: '09:00',
      quickChoices: [
        'Saya punya budget 150 ribu & suka sejarah',
        'Wisata alam & kuliner santai 1 hari',
        'Liburan keluarga hemat di Gresik',
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

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

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      processUserQuery(query);
      setIsTyping(false);
    }, 800);
  };

  const processUserQuery = (query: string) => {
    const lower = query.toLowerCase();

    // Parse Budget
    if (lower.includes('100') || lower.includes('100k') || lower.includes('100 ribu')) {
      updatePreferences({ budget: 100000 });
    } else if (lower.includes('150') || lower.includes('150k') || lower.includes('150 ribu')) {
      updatePreferences({ budget: 150000 });
    } else if (lower.includes('200') || lower.includes('200k') || lower.includes('200 ribu')) {
      updatePreferences({ budget: 200000 });
    } else if (lower.includes('300') || lower.includes('300k') || lower.includes('300 ribu')) {
      updatePreferences({ budget: 300000 });
    }

    // Parse Interests
    const newInterests = [...preferences.interests];
    if (lower.includes('sejarah') && !newInterests.includes('sejarah')) newInterests.push('sejarah');
    if (lower.includes('kuliner') && !newInterests.includes('kuliner')) newInterests.push('kuliner');
    if (lower.includes('alam') && !newInterests.includes('alam')) newInterests.push('alam');
    if (lower.includes('keluarga') && !newInterests.includes('keluarga')) newInterests.push('keluarga');
    if (lower.includes('religi') || lower.includes('ziarah') || lower.includes('wali')) {
      if (!newInterests.includes('religi')) newInterests.push('religi');
    }
    if (newInterests.length > 0) {
      updatePreferences({ interests: newInterests });
    }

    // Parse Duration
    if (lower.includes('setengah hari') || lower.includes('half day')) updatePreferences({ duration: 'half_day' });
    if (lower.includes('1 hari') || lower.includes('satu hari') || lower.includes('1 day')) updatePreferences({ duration: '1_day' });
    if (lower.includes('2 hari') || lower.includes('dua hari') || lower.includes('2 days')) updatePreferences({ duration: '2_days' });

    // Parse Transport
    if (lower.includes('motor')) updatePreferences({ transport: 'motor' });
    if (lower.includes('mobil')) updatePreferences({ transport: 'mobil' });
    if (lower.includes('umum') || lower.includes('bus') || lower.includes('angkot')) updatePreferences({ transport: 'umum' });

    // AI Conversational Flow
    if (lower.includes('sejarah') || lower.includes('alam') || lower.includes('kuliner') || lower.includes('150')) {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Siap! Saya sudah mencatat minat dan budgetmu. Kamu ingin perjalanan berapa lama dan naik kendaraan apa?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        quickChoices: ['Setengah Hari (Motor)', '1 Hari (Motor)', '1 Hari (Mobil)', 'Lanjut ke Rekomendasi'],
      };
      setMessages((prev) => [...prev, aiReply]);
    } else if (lower.includes('motor') || lower.includes('mobil') || lower.includes('hari') || lower.includes('santai')) {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Sempurna! Semua preferensi utamamu telah terangkum. Yuk kita lihat rekomendasi destinasi yang paling cocok.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        quickChoices: ['Lihat Rekomendasi Destinasi', 'Ganti Budget / Minat'],
      };
      setMessages((prev) => [...prev, aiReply]);
    } else {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Baik, saya siap membantu! Saat ini budgetmu tersetting Rp${preferences.budget.toLocaleString('id-ID')}. Pilih opsi di bawah atau ceritakan rencanamu:`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        quickChoices: ['1 Hari Santai (Sejarah & Kuliner)', 'Setengah Hari (Alam & Foto)', 'Lanjut ke Rekomendasi'],
      };
      setMessages((prev) => [...prev, aiReply]);
    }
  };

  const handleQuickChoiceClick = (choice: string) => {
    if (choice.includes('Rekomendasi') || choice.includes('Lanjut')) {
      router.push('/plan/summary');
      return;
    }
    handleSend(choice);
  };

  const handleVisualSelect = (opt: typeof visualOptions[0]) => {
    updatePreferences({ interests: [opt.category] });
    handleSend(`Saya tertarik dengan wisata ${opt.label}`);
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
              <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
            </div>
            <div className="font-label-sm text-xs text-text-secondary mt-0.5">
              Personal Local Companion
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages(initialMessages)}
          className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          title="Reset obrolan"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>

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
                className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface border border-border hover:border-primary transition-all active:scale-95 shadow-2xs"
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
                  {msg.quickChoices.map((choice, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickChoiceClick(choice)}
                      className="px-4 py-2 rounded-full border border-border bg-surface font-button-text text-xs sm:text-sm text-on-surface-variant hover:border-primary hover:text-primary hover:bg-warning-soft/30 transition-all shadow-xs flex items-center gap-1.5 active:scale-95 text-left"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        schedule
                      </span>
                      <span>{choice}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col gap-1">
            <div className="ml-14 font-label-sm text-xs text-text-secondary mb-1">GATRA</div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container text-sm">auto_awesome</span>
              </div>
              <div className="bg-warning-soft px-4 py-3 rounded-[20px] rounded-tl-xs shadow-sm flex gap-1.5 items-center h-[44px]">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
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
            placeholder="Ketik preferensi atau pesan..."
            className="w-full bg-surface border border-border rounded-full py-3.5 pl-12 pr-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all font-body-md text-sm sm:text-base text-on-surface placeholder:text-text-secondary/60"
          />

          <button
            type="submit"
            disabled={!input.trim()}
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

