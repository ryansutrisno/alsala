import React from 'react';
import { AlarmClock } from 'lucide-react';
import { formatCountdown } from '../services/iqomahService';

// Fase iqomah: idle (jam normal), counting (hitung mundur), iqomah (waktunya iqomah)
export type IqomahPhase = 'idle' | 'counting' | 'iqomah';

export interface IqomahCountdownDisplayProps {
  phase: IqomahPhase;
  activePrayerName: string | null; // "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya" | null
  msLeft: number | null;           // sisa ms saat phase === 'counting'
  adzanReminder: boolean;          // true saat adzan otomatis nonaktif
  alarmPlaying: boolean;
  onStopAlarm: () => void;
}

// Tampilan hitung mundur iqomah yang MENGGANTIKAN jam berjalan (gaya jam masjid).
// Komponen ini stateless terhadap timer: nilai msLeft dikirim oleh App setiap detik.
const IqomahCountdownDisplay: React.FC<IqomahCountdownDisplayProps> = ({
  phase,
  activePrayerName,
  msLeft,
  adzanReminder,
  alarmPlaying,
  onStopAlarm,
}) => {
  if (phase === 'idle') {
    return null;
  }

  // Gaya angka besar mengikuti bahasa visual jam utama
  const gayaAngka = 'font-bold font-mono tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]';

  return (
    <div className="text-center px-2 flex flex-col items-center justify-center gap-2 sm:gap-3">

      {phase === 'counting' && (
        <>
          <p className="text-blue-200 text-sm sm:text-base lg:text-xl font-light tracking-widest uppercase">
            Iqomah {activePrayerName ?? ''}
          </p>
          {/* Hitung mundur besar — aria-live agar pembaca layar mendengar berjalan waktu;
              font-mono + tabular-nums agar digit tidak bergoyang; clamp agar terbaca dari TV */}
          <p
            aria-live="polite"
            aria-atomic="true"
            className={`${gayaAngka} text-[clamp(3rem,7.5vw,7.5rem)]`}
          >
            {formatCountdown(msLeft ?? 0)}
          </p>
          {/* Pengingat adzan manual tidak dirender lagi di sini:
              menambah baris di bawah angka membuat konten absolut meluber
              keluar dari area jam (min-h tercadang) dan menutupi blok "MENUJU WAKTU".
              Status adzan Off sudah terlihat di tombol header "Adzan Off".
              Prop adzanReminder tetap dipertahankan agar kontrak props tidak berubah. */}
        </>
      )}

      {phase === 'iqomah' && (
        <>
          {/* Penekanan saat alarm berbunyi: ring amber + denyut halus (hormati reduced motion) */}
          <div
            className={`relative flex flex-col items-center gap-2 sm:gap-3 rounded-2xl px-5 sm:px-8 py-4 sm:py-5 border transition-colors motion-reduce:transition-none ${
              alarmPlaying
                ? 'border-amber-400/60 bg-amber-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {alarmPlaying && (
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/70 animate-pulse motion-reduce:animate-none pointer-events-none" />
            )}
            <div className="flex items-center gap-2 sm:gap-3 text-amber-300">
              <AlarmClock className="w-6 h-6 sm:w-8 sm:h-8" />
              <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-wider">Waktunya Iqomah</p>
            </div>
            <p className="text-sm sm:text-base text-blue-200/90">Silakan kumandangkan iqomah.</p>

            {/* Tombol "Matikan Alarm" tidak dirender: tampilan ini otomatis kembali
                ke jam digital setelah IQOMAH_DISPLAY_MS, dan alarm berhenti sendiri
                (ALARM_MAX_DURATION_MS). Prop alarmPlaying + onStopAlarm tetap ada
                agar kontrak props dengan App.tsx tidak berubah. */}
          </div>
        </>
      )}
    </div>
  );
};

export default IqomahCountdownDisplay;
