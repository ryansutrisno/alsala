import React, { useState } from 'react';
import { AlarmClock, Bell, ChevronDown, Square, Timer, VolumeX } from 'lucide-react';

export type IqomahPhase = 'idle' | 'counting' | 'iqomah';

export interface IqomahCountdownProps {
  phase: IqomahPhase;
  activePrayerName: string | null; // "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya" | null
  msLeft: number | null;           // sisa ms saat phase === 'counting'
  minutes: number;                 // durasi terpilih (5..30, kelipatan 5)
  onMinutesChange: (minutes: number) => void;
  adzanReminder: boolean;          // true saat adzan OFF & sudah masuk waktu sholat
  alarmPlaying: boolean;
  onStopAlarm: () => void;
}

// Pilihan durasi iqomah: 5..30 menit, kelipatan 5
const DURASI_OPSI = [5, 10, 15, 20, 25, 30];

// Helper lokal: format ms → "MM:SS" (tanpa import service apa pun)
const formatMMSS = (ms: number | null): string => {
  if (ms === null || ms <= 0) return '00:00';
  const totalDetik = Math.floor(ms / 1000);
  const menit = Math.floor(totalDetik / 60);
  const detik = totalDetik % 60;
  return `${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;
};

const IqomahCountdown: React.FC<IqomahCountdownProps> = ({
  phase,
  activePrayerName,
  msLeft,
  minutes,
  onMinutesChange,
  adzanReminder,
  alarmPlaying,
  onStopAlarm,
}) => {
  // Dropdown durasi: bisa dibuka di semua phase (idle/counting/iqomah)
  const [durasiTerbuka, setDurasiTerbuka] = useState(false);

  const pilihDurasi = (nilai: number) => {
    onMinutesChange(nilai);
    setDurasiTerbuka(false);
  };

  return (
    <section
      aria-label="Kontrol iqomah"
      className="w-full max-w-md bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-md relative overflow-hidden"
    >
      {/* Baris pemicu dropdown durasi — selalu tampil di semua phase */}
      <button
        type="button"
        onClick={() => setDurasiTerbuka((terbuka) => !terbuka)}
        aria-expanded={durasiTerbuka}
        aria-controls="iqomah-durasi-panel"
        className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 sm:px-3 py-2 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-gray-300 truncate">
            Durasi Iqomah · {minutes} menit
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${durasiTerbuka ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel dropdown durasi: transisi grid-rows agar buka/tutup tidak mengganti ukuran elemen lain */}
      <div
        id="iqomah-durasi-panel"
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${durasiTerbuka ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div
            role="group"
            aria-label="Pilih durasi iqomah"
            className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2.5 sm:pt-3"
          >
            {DURASI_OPSI.map((nilai) => {
              const aktif = nilai === minutes;
              return (
                <button
                  key={nilai}
                  type="button"
                  onClick={() => pilihDurasi(nilai)}
                  aria-pressed={aktif}
                  className={`
                    w-full text-left px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70
                    ${aktif
                      ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  {nilai} menit
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Area status dengan tinggi cadangan tetap (min-height sama untuk semua phase),
        jadi transisi idle → counting → iqomah tidak pernah menggeser layout.
      */}
      <div
        className={`relative mt-3 sm:mt-4 min-h-[12.5rem] sm:min-h-[13rem] rounded-xl sm:rounded-2xl border transition-colors duration-300 motion-reduce:transition-none ${
          alarmPlaying
            ? 'border-amber-400/60 bg-amber-500/10'
            : 'border-white/10 bg-white/5'
        }`}
      >
        {/* Denyut halus saat alarm berbunyi (dihormati motion-reduce) */}
        {alarmPlaying && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-amber-400/70 animate-pulse motion-reduce:animate-none pointer-events-none"
          />
        )}

        {/* Konten status diposisikan absolut di dalam area cadangan — tinggi kartu tidak pernah berubah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 px-4 text-center">

          {phase === 'counting' && (
            <>
              {/* Banner pengingat adzan manual */}
              {adzanReminder && (
                <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-semibold text-amber-300 leading-tight">Waktunya Adzan</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">
                      Adzan otomatis nonaktif — silakan kumandangkan adzan manual.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-purple-300">
                Iqomah {activePrayerName ?? ''}
              </p>
              {/* Hitung mundur besar; aria-live agar pembaca layar tahu perubahan waktu */}
              <p
                aria-live="polite"
                aria-atomic="true"
                className="font-mono text-5xl sm:text-6xl font-bold text-white tabular-nums tracking-tight"
              >
                {formatMMSS(msLeft)}
              </p>
            </>
          )}

          {phase === 'iqomah' && (
            <>
              <div className="flex items-center gap-2 text-amber-300">
                <AlarmClock className="w-5 h-5 sm:w-6 sm:h-6" />
                <p className="text-base sm:text-lg font-bold uppercase tracking-wider">Waktunya Iqomah</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Silakan kumandangkan iqomah.</p>

              {alarmPlaying && (
                <button
                  type="button"
                  onClick={onStopAlarm}
                  title="Matikan Alarm"
                  aria-label="Matikan Alarm"
                  className="mt-1 inline-flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 px-4 sm:px-5 py-2 text-sm font-semibold hover:bg-amber-500/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
                >
                  <Square className="w-4 h-4" />
                  Matikan Alarm
                </button>
              )}
            </>
          )}

          {phase === 'idle' && (
            /* Placeholder visual ringan agar area cadangan tidak terasa kosong */
            <VolumeX aria-hidden="true" className="w-8 h-8 sm:w-10 sm:h-10 text-white/10" />
          )}
        </div>
      </div>
    </section>
  );
};

export default IqomahCountdown;
