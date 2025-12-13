import { PrayerApiResponse, Coordinates, LocationResult } from '../types';
import { db } from './db';

export const getPrayerTimes = async (coords: Coordinates): Promise<PrayerApiResponse | null> => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Cache Key: waqt_cache_YYYY_M_LAT_LON
    const lat = coords.latitude.toFixed(2);
    const lon = coords.longitude.toFixed(2);
    const cacheId = `waqt_prayer_cache_${year}_${month}_${lat}_${lon}`;

    let monthData: any[] = [];

    // 1. Cek Cache IndexedDB (Dexie)
    try {
      const cached = await db.prayerCache.get(cacheId);
      if (cached) {
        monthData = cached.data;
        // console.log("Using cached prayer data from IndexedDB");
      }
    } catch (e) {
      console.warn("IndexedDB read error", e);
    }

    // 2. Jika Cache Kosong, Fetch dari API Calendar (Bulanan)
    if (!monthData || monthData.length === 0) {
      // Method 20 is Kemenag (Indonesia)
      const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=20`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      const json = await response.json();
      
      if (json.code === 200 && Array.isArray(json.data)) {
        monthData = json.data;
        // Simpan ke IndexedDB
        try {
          // Bersihkan cache bulan lalu agar db tidak bengkak (opsional, tapi baik untuk maintenance)
          // Kita bisa hapus data yang bukan bulan ini
          const prevMonth = month === 1 ? 12 : month - 1;
          const prevYear = month === 1 ? year - 1 : year;
          const prevCacheId = `waqt_prayer_cache_${prevYear}_${prevMonth}_${lat}_${lon}`;
          await db.prayerCache.delete(prevCacheId);

          await db.prayerCache.put({
            id: cacheId,
            year,
            month,
            latitude: lat,
            longitude: lon,
            data: monthData,
            timestamp: Date.now()
          });
        } catch (e) {
          console.warn("IndexedDB write error", e);
        }
      }
    }

    // 3. Ambil data hari ini dari array bulanan
    // API Aladhan mengembalikan array object per hari. Kita cari yang tanggalnya cocok.
    const todayData = monthData.find((d: any) => {
      // d.date.gregorian.day bisa "01" atau "1", jadi parse int agar aman saat dibandingkan dengan variable day (number)
      return parseInt(d.date.gregorian.day, 10) === day;
    });

    if (todayData) {
      // Return dalam format PrayerApiResponse (Single Day)
      // Karena struktur item di array 'data' calendar SAMA PERSIS dengan 'data' di endpoint timings harian,
      // kita bisa langsung bungkus.
      return {
        code: 200,
        status: "OK",
        data: todayData
      } as PrayerApiResponse;
    }

    return null;

  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};

export const searchLocation = async (query: string): Promise<LocationResult[]> => {
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching location:", error);
    return [];
  }
};

export const getNextPrayer = (timings: any): { name: string; time: string; diffMs: number } | null => {
  if (!timings) return null;

  const now = new Date();
  // Included Imsak in the cycle
  const prayerNames = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  let nextPrayerName = '';
  let nextPrayerTime = '';
  let minDiff = Infinity;
  let found = false;

  for (const name of prayerNames) {
    let timeStr = timings[name];
    if (!timeStr) continue;

    // Clean time string: remove timezone suffix like " (WIB)" or " (UTC)"
    timeStr = timeStr.split(' ')[0];

    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    let diff = prayerDate.getTime() - now.getTime();

    // If prayer is earlier today, it's passed.
    if (diff < 0) {
      continue;
    }

    if (diff < minDiff) {
      minDiff = diff;
      nextPrayerName = name;
      nextPrayerTime = timeStr;
      found = true;
    }
  }

  // If all prayers for today passed, next is Imsak tomorrow
  if (!found) {
    let timeStr = timings['Imsak']; // Loop back to Imsak
    
    // Clean time string here too
    const cleanTimeStr = timeStr.split(' ')[0];
    const [hours, minutes] = cleanTimeStr.split(':').map(Number);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    nextPrayerName = 'Imsak';
    nextPrayerTime = timeStr; // Keep original format for display if preferred, or use cleanTimeStr
    minDiff = tomorrow.getTime() - now.getTime();
  }

  return { name: nextPrayerName, time: nextPrayerTime, diffMs: minDiff };
};