import Dexie, { Table } from 'dexie';

export interface PrayerCache {
  id: string; // Composite key: year_month_lat_lon
  year: number;
  month: number;
  latitude: string;
  longitude: string;
  data: any[]; // Array of daily prayer times
  timestamp: number; // For cleanup if needed
}

export class WaqtDatabase extends Dexie {
  prayerCache!: Table<PrayerCache>;

  constructor() {
    super('WaqtDatabase');
    this.version(1).stores({
      prayerCache: 'id, [year+month], [latitude+longitude]' // Indexes
    });
  }
}

export const db = new WaqtDatabase();