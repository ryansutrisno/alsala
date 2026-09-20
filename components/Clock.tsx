import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Nama hari memakai ejaan "Ahad" (bukan "Minggu" bawaan locale id-ID)
  const HARI = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const formatDate = (date: Date) => {
    const tanggal = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return `${HARI[date.getDay()]}, ${tanggal}`;
  };

  return (
    <div className="text-center px-2">
      {/* Jam sangat besar untuk dibaca dari jarak jauh (laptop/tablet/Smart TV);
          tabular-nums agar lebar digit tidak bergoyang tiap detik */}
      <h2 className="text-[clamp(2.5rem,8.5vw,8rem)] font-bold tracking-tighter tabular-nums leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {formatTime(time)}
      </h2>
      <p className="text-blue-200 mt-2 sm:mt-3 text-xs sm:text-base md:text-lg xl:text-xl font-light tracking-widest uppercase">
        {formatDate(time)}
      </p>
    </div>
  );
};

export default Clock;
