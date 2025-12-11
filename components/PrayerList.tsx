import React from 'react';
import { PrayerTimes } from '../types';
import { Sun, Sunset, Moon, CloudMoon, Clock, CloudSun } from 'lucide-react';

interface PrayerListProps {
  timings: PrayerTimes;
  nextPrayer: string;
}

const PrayerList: React.FC<PrayerListProps> = ({ timings, nextPrayer }) => {
  const prayers = [
    { key: 'Imsak', label: 'Imsak', icon: <Clock className="w-6 h-6" /> },
    { key: 'Fajr', label: 'Subuh', icon: <CloudMoon className="w-6 h-6" /> },
    { key: 'Dhuhr', label: 'Dzuhur', icon: <Sun className="w-6 h-6" /> },
    { key: 'Asr', label: 'Ashar', icon: <CloudSun className="w-6 h-6 opacity-75" /> },
    { key: 'Maghrib', label: 'Maghrib', icon: <Sunset className="w-6 h-6" /> },
    { key: 'Isha', label: 'Isya', icon: <Moon className="w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
      {prayers.map((prayer) => {
        const isActive = prayer.key === nextPrayer;
        return (
          <div
            key={prayer.key}
            className={`
              relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all duration-300
              ${isActive 
                ? 'bg-gradient-to-b from-sky-500 to-indigo-600 shadow-[0_0_30px_rgba(56,189,248,0.3)] scale-105 border border-sky-400/50' 
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
            <span className={`text-sm uppercase tracking-wider font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {prayer.label}
            </span>
            <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>
              {timings[prayer.key as keyof PrayerTimes]}
            </span>
            
            {isActive && (
              <div className="absolute top-0 right-0 p-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrayerList;