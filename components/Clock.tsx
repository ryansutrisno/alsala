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
      {/* Strategi ukuran jam:
          - Mobile (<sm): clamp murni dari LEBAR viewport (3.5rem–4.5rem, skala 18vw)
            supaya angka besar & terbaca (±56–64px) di layar 360–390px yang tadinya
            jatuh ke batas bawah 2.5rem (40px, terlalu kecil).
          - sm+ tinggi > 820px: perilaku lama clamp(2.5rem,8.5vw,8rem) — tidak diubah.
          - sm+ layar pendek (tinggi ≤820px, mis. laptop 1366x768): skala 6vw (±82px
            di 1366px) agar lebar teks "HH.MM.SS" ~394px muat di kolom kiri
            lg:col-span-5 (±447px) dengan margin aman — tidak menempel kartu IMSAK,
            dan halaman tetap tanpa scroll vertikal.
          tabular-nums agar lebar digit tidak bergoyang tiap detik. */}
      <h2 className="text-[clamp(3.5rem,18vw,4.5rem)] sm:text-[clamp(2.5rem,8.5vw,8rem)] [@media(max-height:820px)]:sm:text-[clamp(2.4rem,6vw,7rem)] font-bold tracking-tighter tabular-nums leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {formatTime(time)}
      </h2>
      <p className="text-blue-200 mt-2 sm:mt-3 text-xs sm:text-base md:text-lg xl:text-xl font-light tracking-widest uppercase [@media(max-height:820px)]:sm:mt-1.5 [@media(max-height:820px)]:xl:text-base">
        {formatDate(time)}
      </p>
    </div>
  );
};

export default Clock;
