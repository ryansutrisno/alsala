import React from 'react';
import { PrayerTimes } from '../types';
import { Sun, Sunset, Moon, CloudMoon, Clock, CloudSun } from 'lucide-react';

interface PrayerListProps {
  timings: PrayerTimes;
  nextPrayer: string;
}

const PrayerList: React.FC<PrayerListProps> = ({ timings, nextPrayer }) => {
  const prayers = [
    // Layar pendek (≤820px, mis. laptop 1366x768): ikon xl disusutkan (w-7/h-7)
    // agar baris kartu 3x2 tidak mendorong footer keluar viewport.
    { key: 'Imsak', label: 'Imsak', icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7" /> },
    { key: 'Fajr', label: 'Subuh', icon: <CloudMoon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7" /> },
    { key: 'Dhuhr', label: 'Dzuhur', icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7" /> },
    { key: 'Asr', label: 'Ashar', icon: <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7 opacity-75" /> },
    { key: 'Maghrib', label: 'Maghrib', icon: <Sunset className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7" /> },
    { key: 'Isha', label: 'Isya', icon: <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 xl:w-8 xl:h-8 [@media(max-height:820px)]:xl:w-7 [@media(max-height:820px)]:xl:h-7" /> },
  ];

  return (
    <div className="contents">
      {prayers.map((prayer) => {
        const isActive = prayer.key === nextPrayer;
        // Buang akhiran zona waktu dari API ("04:30 (WIB)") agar jam selalu satu baris
        const jamBersih = String(timings[prayer.key as keyof PrayerTimes]).split(' ')[0];
        return (
          <div
            key={prayer.key}
            className={`
              relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 xl:p-7 [@media(max-height:820px)]:xl:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all duration-300
              ${isActive
                ? 'bg-gradient-to-b from-sky-500 to-indigo-600 shadow-[0_0_20px_rgba(56,189,248,0.3)] sm:shadow-[0_0_30px_rgba(56,189,248,0.3)] scale-[1.02] sm:scale-105 border border-sky-400/50'
                : 'bg-white/5 hover:bg-white/10 border border-white/5'
              }
              backdrop-blur-md
            `}
          >
            <div className={`
              ${isActive ? 'text-white' : 'text-sky-300'}
            `}>
              {prayer.icon}
            </div>
            {/* Label minimal 18px efektif di layar besar agar terbaca dari jarak jauh */}
            <span className={`text-[10px] sm:text-xs md:text-sm xl:text-lg uppercase tracking-wider font-semibold [@media(max-height:820px)]:xl:text-base ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {prayer.label}
            </span>
            <span className={`text-lg sm:text-xl md:text-2xl xl:text-4xl font-bold whitespace-nowrap [@media(max-height:820px)]:xl:text-3xl ${isActive ? 'text-white' : 'text-white'}`}>
              {jamBersih}
            </span>

            {isActive && (
              <div className="absolute top-0 right-0 p-1 sm:p-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrayerList;