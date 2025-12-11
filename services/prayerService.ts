import { PrayerApiResponse, Coordinates, LocationResult } from '../types';

export const getPrayerTimes = async (coords: Coordinates): Promise<PrayerApiResponse | null> => {
  try {
    const date = new Date();
    // Method 2 (ISNA) is generally safe, but for Indonesia, Ministry of Religious Affairs (Kemenag) is ideal. 
    // Aladhan doesn't strictly have Kemenag ID easily exposed without specific method params, 
    // but ISNA or Muslim World League is a good default fallback.
    // Adding school=1 for Shafi'i (standard in Indonesia) might be relevant for Asr calculation in some methods.
    const url = `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=20`; // Method 20 is Kemenag (Indonesia)
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    const data: PrayerApiResponse = await response.json();
    return data;
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
    const timeStr = timings[name];
    if (!timeStr) continue;

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
    const timeStr = timings['Imsak']; // Loop back to Imsak
    const [hours, minutes] = timeStr.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    nextPrayerName = 'Imsak';
    nextPrayerTime = timeStr;
    minDiff = tomorrow.getTime() - now.getTime();
  }

  return { name: nextPrayerName, time: nextPrayerTime, diffMs: minDiff };
};