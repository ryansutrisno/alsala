import { Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { InspirationContent } from '../types';

interface InspirationCardProps {
  content: InspirationContent | null;
  loading: boolean;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ content, loading }) => {
  // Quote lama tetap ditampilkan selama refresh, jadi kartu tidak pernah "kosong"
  const [displayed, setDisplayed] = useState<InspirationContent | null>(content);
  const [isVisible, setIsVisible] = useState(true);
  const displayedRef = useRef<InspirationContent | null>(content);

  useEffect(() => {
    // Belum ada konten sama sekali (fetch pertama) — biarkan skeleton yang tampil
    if (!content || content === displayedRef.current) return;

    const swap = () => {
      displayedRef.current = content;
      setDisplayed(content);
      setIsVisible(false);
      // Fade-in pada frame berikutnya agar transisi terlihat mulus
      requestAnimationFrame(() => setIsVisible(true));
    };

    if (!displayedRef.current) {
      // Konten pertama kali: langsung tampil dengan fade-in halus
      swap();
      return;
    }

    // Refresh: fade-out quote lama dulu, baru swap ke yang baru (tanpa remount)
    setIsVisible(false);
    const timer = setTimeout(swap, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [content]);

  // Skeleton hanya untuk load pertama; saat refresh quote lama tetap terlihat
  const isFirstLoad = loading && !content && !displayed;
  // Affordance halus saat refresh di latar belakang
  const isRefreshing = loading && !!content;

  return (
    <div className="w-full bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md relative overflow-hidden group">

      {/* Decorative Glow */}
      <div className={`absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700 ${isRefreshing ? 'opacity-60' : 'opacity-100'}`} />

      <div className="flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
        <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin [animation-duration:2.5s] motion-reduce:animate-none' : ''}`} />
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Inspirasi Harian</span>
      </div>

      {isFirstLoad ? (
        <div className="space-y-2 sm:space-y-3 animate-pulse">
          <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ) : displayed ? (
        <div
          className="space-y-3 sm:space-y-4 transition-all duration-500 ease-out motion-reduce:transition-none"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(4px)' }}
        >
          {/* Min-height disiapkan agar tinggi kartu stabil saat panjang quote berubah */}
          <blockquote className="min-h-[4.5rem] sm:min-h-[5rem] lg:min-h-[6.5rem] text-base sm:text-lg md:text-xl lg:text-2xl font-serif text-white leading-relaxed italic">
            "{displayed.quote}"
          </blockquote>

          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2 sm:gap-4 border-t border-white/10 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 text-sky-400 text-xs sm:text-sm font-medium whitespace-nowrap bg-sky-500/10 px-2 sm:px-3 py-1 rounded-full">
              <span>{displayed.source}</span>
            </div>
          </div>

          {displayed.reflection && (
             <div className="mt-2 text-xs sm:text-sm text-gray-400 border-l-2 border-purple-500/30 pl-3">
               {displayed.reflection}
             </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Gagal memuat inspirasi.</p>
      )}
    </div>
  );
};

export default InspirationCard;
