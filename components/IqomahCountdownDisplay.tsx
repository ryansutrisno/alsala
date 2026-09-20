import React from 'react';
import { AlarmClock, Square } from 'lucide-react';
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
    <div className="text-center px-2 flex flex-col items-center justify-center gap-2">

      {phase === 'counting' && (
        <>
          <p className="text-blue-200 text-sm sm:text-base font-light tracking-widest uppercase">
            Iqomah {activePrayerName ?? ''}
          </p>
          {/* Hitung mundur besar — aria-live agar pembaca layar mendengar berjalan waktu */}
          <p
            aria-live="polite"
            aria-atomic="true"
            className={`${gayaAngka} text-5xl xs:text-6xl sm:text-7xl`}
          >
            {formatCountdown(msLeft ?? 0)}
          </p>
          {/* Pengingat hanya saat adzan otomatis Off */}
          {adzanReminder && (
            <p className="text-[10px] sm:text-xs text-red-300 font-medium">
              Adzan otomatis nonaktif — kumandangkan adzan manual.
            </p>
          )}
        </>
      )}

      {phase === 'iqomah' && (
        <>
          {/* Penekanan saat alarm berbunyi: ring amber + denyut halus (hormati reduced motion) */}
          <div
            className={`relative flex flex-col items-center gap-2 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border transition-colors motion-reduce:transition-none ${
              alarmPlaying
                ? 'border-amber-400/60 bg-amber-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {alarmPlaying && (
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl ring-2 ring-amber-400/70 animate-pulse motion-reduce:animate-none pointer-events-none" />
            )}
            <div className="flex items-center gap-2 text-amber-300">
              <AlarmClock className="w-5 h-5 sm:w-6 sm:h-6" />
              <p className="text-2xl sm:text-3xl font-bold uppercase tracking-wider">Waktunya Iqomah</p>
            </div>
            <p className="text-xs sm:text-sm text-blue-200/80">Silakan kumandangkan iqomah.</p>

            {alarmPlaying && (
              <button
                type="button"
                onClick={onStopAlarm}
                title="Matikan Alarm"
                aria-label="Matikan Alarm"
                className="mt-1 inline-flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-amber-500/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Matikan Alarm
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default IqomahCountdownDisplay;
