import { Sparkles } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InspirationContent } from '../types';

interface InspirationCardProps {
  content: InspirationContent | null;
  loading: boolean;
}

// Kecepatan marquee vertikal konstan dalam px per detik — durasi dihitung
// proporsional terhadap tinggi konten, bukan durasi tetap.
const KECEPATAN_PX_PER_DETIK = 18;
// Jarak antar salinan konten saat diduplikasi untuk loop mulus (harus sama dengan mt-4)
const JARAK_SALINAN_PX = 16;
// Durasi minimal agar quote pendek yang kebetulan overflow tidak melintas terlalu cepat
const DURASI_MINIMUM_DETIK = 10;

// Keyframes marquee vertikal: menggeser track sebesar tinggi satu salinan
// (diset lewat CSS variable agar selalu pas, tanpa angka ajaib).
// prefers-reduced-motion: animasi dimatikan, teks tetap terbaca diam di tempat.
const GAYA_MARQUEE = `
@keyframes inspirasi-scroll-vertikal {
  from { transform: translateY(0); }
  to { transform: translateY(var(--inspirasi-shift, -50%)); }
}
.inspirasi-marquee-track {
  animation: inspirasi-scroll-vertikal var(--inspirasi-dur, 30s) linear infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .inspirasi-marquee-track { animation: none; }
}
/* Fade halus di tepi atas/bawah viewport (0.75rem) agar teks tidak terpotong kasar */
.inspirasi-marquee-viewport {
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 0.75rem, black calc(100% - 0.75rem), transparent);
  mask-image: linear-gradient(to bottom, transparent, black 0.75rem, black calc(100% - 0.75rem), transparent);
}
`;

const InspirationCard: React.FC<InspirationCardProps> = ({ content, loading }) => {
  // Quote lama tetap ditampilkan selama refresh, jadi kartu tidak pernah "kosong"
  const [displayed, setDisplayed] = useState<InspirationContent | null>(content);
  const [isVisible, setIsVisible] = useState(true);
  const displayedRef = useRef<InspirationContent | null>(content);

  // Marquee: hanya aktif jika konten lebih tinggi dari viewport teks
  const [marqueeAktif, setMarqueeAktif] = useState(false);
  const [shiftPx, setShiftPx] = useState(0);
  const [durasiDetik, setDurasiDetik] = useState(30);

  const viewportRef = useRef<HTMLDivElement>(null);
  const salinanRef = useRef<HTMLDivElement>(null);

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

  // Ukur konten setiap kali quote berubah: aktifkan marquee hanya bila overflow,
  // dan hitung durasi proporsional (kecepatan px/detik konstan).
  useLayoutEffect(() => {
    const ukur = () => {
      const viewport = viewportRef.current;
      const salinan = salinanRef.current;
      if (!viewport || !salinan) {
        setMarqueeAktif(false);
        return;
      }
      const tinggiViewport = viewport.clientHeight;
      const tinggiKonten = salinan.offsetHeight;
      const overflow = tinggiKonten > tinggiViewport + 1;
      if (overflow) {
        const jarakLengkung = tinggiKonten + JARAK_SALINAN_PX;
        setShiftPx(-jarakLengkung);
        setDurasiDetik(Math.max(DURASI_MINIMUM_DETIK, jarakLengkung / KECEPATAN_PX_PER_DETIK));
        setMarqueeAktif(true);
      } else {
        setMarqueeAktif(false);
      }
    };
    ukur();
    window.addEventListener('resize', ukur);
    return () => window.removeEventListener('resize', ukur);
  }, [displayed, isVisible]);

  // Skeleton hanya untuk load pertama; saat refresh quote lama tetap terlihat
  const isFirstLoad = loading && !content && !displayed;
  // Affordance halus saat refresh di latar belakang
  const isRefreshing = loading && !!content;

  // Kunci track: berubah saat quote/reflection berganti → elemen remount
  // → animasi mulai lagi dari posisi awal (restart dari atas).
  const kunciTrack = `${displayed?.quote ?? ''}|${displayed?.reflection ?? ''}`;

  // Jangan tambahkan kutip lagi bila teks quote sudah diakhiri tanda kutip sendiri
  // (terjemahan Kemenag kerap berakhiran `."` — kutip dobel terlihat seperti `.""`)
  const bungkusKutip = (teks: string): string => {
    const bersih = teks.trim();
    return /["\u201D]$/.test(bersih) ? bersih : `"${bersih}"`;
  };

  // Konten satu salinan (dipakai lagi untuk duplikasi loop mulus)
  const renderSalinan = (ariaHidden: boolean) => (
    <div
      ref={ariaHidden ? undefined : salinanRef}
      aria-hidden={ariaHidden ? true : undefined}
      className="text-left"
    >
      <blockquote className="text-base sm:text-lg font-serif text-white leading-relaxed italic">
        {bungkusKutip(displayed?.quote ?? '')}
      </blockquote>
      {displayed?.reflection && (
        <div className="mt-2 text-xs sm:text-sm text-gray-400 border-l-2 border-purple-500/30 pl-3">
          {displayed.reflection}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden group">
      {/* Gaya marquee lokal (keyframes + aturan reduced-motion) */}
      <style>{GAYA_MARQUEE}</style>

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
          className="transition-all duration-500 ease-out motion-reduce:transition-none"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(4px)' }}
        >
          {/*
            Viewport teks bertinggi TETAP (±3 baris): tinggi kartu konstan
            berapa pun panjang quote — konten panjang mengalir vertikal pelan.
          */}
          <div
            ref={viewportRef}
            className="inspirasi-marquee-viewport relative h-24 sm:h-28 overflow-hidden"
          >
            {/*
              Track bergulir: key remount saat quote berganti agar animasi
              restart dari awal. Teks tetap ada di DOM (tidak disembunyikan
              dari screen reader).
            */}
            <div
              key={kunciTrack}
              className={marqueeAktif ? 'inspirasi-marquee-track' : ''}
              style={
                marqueeAktif
                  ? ({
                      '--inspirasi-shift': `${shiftPx}px`,
                      '--inspirasi-dur': `${durasiDetik}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {renderSalinan(false)}
              {marqueeAktif && (
                <div className="mt-4">
                  {renderSalinan(true)}
                </div>
              )}
            </div>
          </div>

          {/* Sumber tetap diam di kanan bawah, di luar area bergulir */}
          <div className="flex justify-end border-t border-white/10 pt-3 sm:pt-4">
            <div className="flex items-center text-sky-400 text-xs sm:text-sm font-medium whitespace-nowrap bg-sky-500/10 px-2 sm:px-3 py-1 rounded-full">
              <span>{displayed.source}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Gagal memuat inspirasi.</p>
      )}
    </div>
  );
};

export default InspirationCard;
