export interface PrayerTimes {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

export interface PrayerApiResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimes;
    date: {
      readable: string;
      timestamp: string;
      hijri: HijriDate;
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        name: string;
        id: number;
      };
    };
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  locationName?: string; // Optional custom name
}

export interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface InspirationContent {
  quote: string;
  source: string;
  reflection: string;
}