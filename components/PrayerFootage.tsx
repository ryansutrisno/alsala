import React, { useEffect, useState } from 'react';
import { PrayerTimes } from '../types';

export interface PrayerFootageProps {
  timings: PrayerTimes | null; // jadwal sholat hari ini (bisa belum termuat)
  nowMs: number;               // waktu sekarang dari state App (di-update tiap detik)
}

// Klip footage Makkah (1080p, tanpa audio) + poster masing-masing
const DAFTAR_KLIP = [
  { id: 'isya-subuh', video: '/makkah-isya-subuh.mp4', poster: '/makkah-isya-subuh-poster.jpg' },
  { id: 'dhuhur-ashar', video: '/makkah-dhuhur-ashar.mp4', poster: '/makkah-dhuhur-ashar-poster.jpg' },
  { id: 'maghrib-isya', video: '/makkah-maghrib-isya.mp4', poster: '/makkah-maghrib-isya-poster.jpg' },
] as const;

type Klip = (typeof DAFTAR_KLIP)[number];
type IdKlip = Klip['id'];

const KLIP_ISYA_SUBUH = DAFTAR_KLIP.find((k) => k.id === 'isya-subuh') as Klip;
const KLIP_DHURUR_ASHAR = DAFTAR_KLIP.find((k) => k.id === 'dhuhur-ashar') as Klip;
const KLIP_MAGHRIB_ISYA = DAFTAR_KLIP.find((k) => k.id === 'maghrib-isya') as Klip;

// Parse "HH:MM WIB" menjadi jumlah menit dalam sehari
const menitDariWaktu = (waktu: string): number | null => {
  const bersih = waktu.split(' ')[0].split(':');
  if (bersih.length !== 2) return null;
  const jam = Number(bersih[0]);
  const menit = Number(bersih[1]);
  if (!Number.isInteger(jam) || !Number.isInteger(menit)) return null;
  return jam * 60 + menit;
};

// Pilih klip sesuai rentang waktu (siklus penuh tanpa gap, aman lewat tengah malam):
// Subuh s/d sebelum Ashar  -> dhuhur-ashar
// Ashar s/d sebelum Isya   -> maghrib-isya
// Isya s/d Subuh berikutnya (termasuk tengah malam & Imsak) -> isya-subuh
const pilihKlip = (timings: PrayerTimes | null, nowMs: number): Klip | null => {
  if (!timings) return null;

  const subuh = menitDariWaktu(timings.Fajr);
  const ashar = menitDariWaktu(timings.Asr);
  const isya = menitDariWaktu(timings.Isha);
  if (subuh === null || ashar === null || isya === null) return null;

  const sekarang = new Date(nowMs);
  const menitSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();

  if (menitSekarang < subuh) return KLIP_ISYA_SUBUH;
  if (menitSekarang < ashar) return KLIP_DHURUR_ASHAR;
  if (menitSekarang < isya) return KLIP_MAGHRIB_ISYA;
  return KLIP_ISYA_SUBUH;
};

const PrayerFootage: React.FC<PrayerFootageProps> = ({ timings, nowMs }) => {
  // Klip yang seharusnya tampil berdasarkan rentang waktu saat ini
  const klip: Klip | null = pilihKlip(timings, nowMs);

  // Tumpukan lapisan untuk crossfade: maksimal 2 (lama di bawah, baru di atas)
  const [lapisan, setLapisan] = useState<Klip[]>([]);

  // Opasitas lapisan teratas — crossfade manual (tidak bergantung plugin animasi Tailwind)
  const [opasitasAtas, setOpasitasAtas] = useState(1);

  // Hormati prefers-reduced-motion: poster saja, tanpa autoplay/loop
  const [gerakDikurangi, setGerakDikurangi] = useState<boolean>(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pantau = () => setGerakDikurangi(media.matches);
    pantau();
    media.addEventListener('change', pantau);
    return () => media.removeEventListener('change', pantau);
  }, []);

  // Saat rentang berganti: pasang lapisan baru di atas lapisan lama (maksimal 2)
  useEffect(() => {
    setLapisan((sebelum) => {
      if (!klip) {
        return sebelum.length === 0 ? sebelum : [];
      }
      const terakhir = sebelum[sebelum.length - 1];
      if (terakhir && terakhir.id === klip.id) return sebelum;
      return terakhir ? [terakhir, klip] : [klip];
    });
  }, [klip]);

  // Setelah crossfade selesai (durasi fade 700ms + margin), buang lapisan lama
  useEffect(() => {
    if (lapisan.length < 2) return;
    const timer = setTimeout(() => {
      setLapisan((sebelum) => sebelum.slice(-1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [lapisan]);

  // Crossfade manual: lapisan baru mulai dari opasitas 0 lalu naik bertahap ke 1
  useEffect(() => {
    if (lapisan.length < 2) {
      setOpasitasAtas(1);
      return;
    }
    setOpasitasAtas(0);
    const raf = requestAnimationFrame(() => setOpasitasAtas(1));
    return () => cancelAnimationFrame(raf);
  }, [lapisan]);

  const aktif = lapisan.length > 0 ? lapisan[lapisan.length - 1] : null;

  if (!aktif) return null;

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 aspect-video lg:aspect-auto lg:h-full lg:min-h-0"
    >
      {gerakDikurangi ? (
        /* Reduced motion: hanya poster statis, tanpa video yang berjalan */
        <img
          src={aktif.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        lapisan.map((persona, indeks) => {
          const mulai = indeks === lapisan.length - 1;
          return (
            <video
              key={persona.id}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={persona.poster}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none"
              style={{ opacity: mulai ? opasitasAtas : 1 }}
            >
              <source src={persona.video} />
            </video>
          );
        })
      )}
    </div>
  );
};

export default PrayerFootage;
