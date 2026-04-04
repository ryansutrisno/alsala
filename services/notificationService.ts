/**
 * Notification Service for Alsala Prayer Times App
 * Handles local notifications for Adzan when app is closed/PWA installed
 */

import Dexie, { Table } from 'dexie';

// Interface for scheduled notification
export interface ScheduledNotification {
  id?: number;
  prayerName: string;
  prayerTime: string; // HH:mm format
  date: string; // YYYY-MM-DD format
  notificationId: string;
  enabled: boolean;
}

// Database for storing scheduled notifications
class NotificationDatabase extends Dexie {
  scheduledNotifications!: Table<ScheduledNotification>;

  constructor() {
    super('AlsalaNotifications');
    this.version(1).stores({
      scheduledNotifications: '++id, prayerName, prayerTime, date, notificationId, enabled'
    });
  }
}

const db = new NotificationDatabase();

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Audio file URLs
const ADHAN_FAJR_URL = '/Adzan_Subuh_Merdu.mp3';
const ADHAN_GENERAL_URL = '/Adzan_Mekkah_Versi_Full.mp3';

// Storage keys
const NOTIFICATION_PERMISSION_KEY = 'waqt_notification_permission';
const NOTIFICATION_ENABLED_KEY = 'waqt_notifications_enabled';

// Global deduplication state to prevent double adzan
let isAdzanPlaying = false;
let currentAdzanPrayer: string | null = null;
let lastAdzanTimestamp: number = 0;
const ADZAN_COOLDOWN_MS = 30000; // 30 seconds cooldown between same prayer

/**
 * Request notification permission from user
 * @returns Promise<NotificationPermission> - 'granted', 'denied', or 'default'
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  
  // Save permission status
  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
  
  console.log('[Notification] Permission status:', permission);
  return permission;
}

/**
 * Get current notification permission status
 * @returns NotificationPermission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  return Notification.permission;
}

/**
 * Check if notifications are enabled by user preference
 * @returns boolean
 */
export function isNotificationsEnabled(): boolean {
  return localStorage.getItem(NOTIFICATION_ENABLED_KEY) === 'true';
}

/**
 * Set notifications enabled/disabled by user
 * @param enabled boolean
 */
export function setNotificationsEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled.toString());
}

/**
 * Clear all scheduled notifications from the database
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    // First, cancel all pending scheduled notifications
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      // Send message to SW to clear all notifications
      registration.active?.postMessage({
        type: 'CLEAR_ALL_NOTIFICATIONS'
      });
    }

    // Clear from IndexedDB
    await db.scheduledNotifications.clear();
    console.log('[Notification] All notifications cleared');
  } catch (error) {
    console.error('[Notification] Error clearing notifications:', error);
  }
}

/**
 * Get prayer name in Indonesian
 */
function getIndonesianPrayerName(englishName: string): string {
  const nameMap: Record<string, string> = {
    'Fajr': 'Subuh',
    'Dhuhr': 'Dzuhur',
    'Asr': 'Ashar',
    'Maghrib': 'Maghrib',
    'Isha': 'Isya'
  };
  return nameMap[englishName] || englishName;
}

/**
 * Get audio URL for prayer
 */
function getAdzanAudioUrl(prayerName: string): string {
  return prayerName === 'Fajr' ? ADHAN_FAJR_URL : ADHAN_GENERAL_URL;
}

/**
 * Schedule a single notification for a prayer time
 */
async function scheduleNotification(
  prayerName: string, 
  prayerTime: string, 
  date: string
): Promise<string | null> {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('[Notification] Permission not granted, skipping schedule');
    return null;
  }

  const notificationId = `adzan-${prayerName.toLowerCase()}-${date}`;
  const indonesianName = getIndonesianPrayerName(prayerName);
  const audioUrl = getAdzanAudioUrl(prayerName);
  
  // Parse time
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  // Calculate delay until notification time
  const now = new Date();
  const notificationTime = new Date(date);
  notificationTime.setHours(hours, minutes, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }
  
  const delay = notificationTime.getTime() - now.getTime();
  
  // Don't schedule if more than 24 hours away
  if (delay > 24 * 60 * 60 * 1000) {
    console.log(`[Notification] Skipping ${prayerName} - too far in the future`);
    return null;
  }

  // Store in database
  const id = await db.scheduledNotifications.add({
    prayerName,
    prayerTime,
    date: notificationTime.toISOString().split('T')[0],
    notificationId,
    enabled: true
  });

  console.log(`[Notification] Scheduled ${indonesianName} at ${prayerTime} (delay: ${Math.round(delay / 1000)}s)`);

  // Schedule using setTimeout (for when app is open)
  // Service Worker will handle when app is closed
  setTimeout(() => {
    showAdzanNotification(prayerName, prayerTime, audioUrl);
  }, delay);

  return notificationId;
}

/**
 * Show the actual adzan notification
 */
function showAdzanNotification(prayerName: string, prayerTime: string, audioUrl: string): void {
  if (Notification.permission !== 'granted') {
    return;
  }

  const indonesianName = getIndonesianPrayerName(prayerName);
  const notificationId = `adzan-${prayerName.toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

  const notification = new Notification(`🕌 Waktu Sholat ${indonesianName}`, {
    body: `Saatnya melaksanakan sholat ${indonesianName} (${prayerTime})`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: notificationId,
    requireInteraction: true,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Play audio (works when app is in foreground)
  playAdzanAudio(prayerName);

  console.log(`[Notification] Showing notification for ${indonesianName}`);
}

/**
 * Play adzan audio with deduplication to prevent double sound
 */
export function playAdzanAudio(prayerName: string): void {
  const now = Date.now();
  
  // Check if adzan is already playing for the same prayer
  if (isAdzanPlaying && currentAdzanPrayer === prayerName) {
    console.log('[Audio] Skipping - already playing for', prayerName);
    return;
  }
  
  // Check cooldown period (prevent duplicate within 30 seconds)
  if (currentAdzanPrayer === prayerName && (now - lastAdzanTimestamp) < ADZAN_COOLDOWN_MS) {
    console.log('[Audio] Skipping - cooldown period active for', prayerName);
    return;
  }
  
  isAdzanPlaying = true;
  currentAdzanPrayer = prayerName;
  lastAdzanTimestamp = now;
  
  const audio = new Audio();
  audio.src = getAdzanAudioUrl(prayerName);
  audio.volume = 1.0;
  
  // Reset state when audio ends or errors
  const resetState = () => {
    isAdzanPlaying = false;
    currentAdzanPrayer = null;
  };
  
  audio.onended = resetState;
  audio.onerror = () => {
    console.error('[Audio] Error playing adzan for', prayerName);
    resetState();
  };
  
  audio.play().catch(error => {
    console.error('[Audio] Error playing adzan:', error);
    resetState();
  });
}

/**
 * Schedule notifications for all prayer times
 * @param timings Object containing prayer times from API
 */
export async function schedulePrayerNotifications(timings: Record<string, string>): Promise<void> {
  // Clear existing notifications first
  await clearAllNotifications();

  // Get current date
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Allowed prayers for adzan
  const allowedPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const [prayerName, time] of Object.entries(timings)) {
    if (!allowedPrayers.includes(prayerName)) {
      continue;
    }

    // Clean time string (remove timezone info if present)
    const cleanTime = (time as string).split(' ')[0];
    
    // Schedule for today
    await scheduleNotification(prayerName, cleanTime, today);
    
    // Also schedule for tomorrow (so user doesn't miss if they open app late)
    await scheduleNotification(prayerName, cleanTime, tomorrow);
  }

  console.log('[Notification] All prayer notifications scheduled');
}

/**
 * Initialize notification system on app load
 * Checks permission and sets up event listeners
 */
export async function initNotifications(): Promise<void> {
  if ('Notification' in window) {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, Notification.permission);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        window.focus();
      }
    });
  }
}

/**
 * Get scheduled notifications from database
 */
export async function getScheduledNotifications(): Promise<ScheduledNotification[]> {
  return await db.scheduledNotifications.toArray();
}