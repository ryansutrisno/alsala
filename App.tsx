import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Navigation, RefreshCw, Search, X, Loader2, Volume2, VolumeX, Bell, BellOff, Timer } from 'lucide-react';
import Clock from './components/Clock';
import PrayerList from './components/PrayerList';
import InspirationCard from './components/InspirationCard';
import PrayerFootage from './components/PrayerFootage';
import IqomahCountdownDisplay, { type IqomahPhase } from './components/IqomahCountdownDisplay';
import IqomahDurationModal from './components/IqomahDurationModal';
import { getPrayerTimes, getNextPrayer, searchLocation } from './services/prayerService';
import { getDailyInspiration } from './services/quoteService';
import { schedulePrayerNotifications, clearAllNotifications, requestNotificationPermission, initNotifications, isNotificationSupported, getNotificationPermission } from './services/notificationService';
import { IQOMAH_OPTIONS, type IqomahMinutes, getIqomahMinutes, setIqomahMinutes, computeIqomahTarget, unlockAlarmAudio, playAlarm, stopAlarm, isAlarmPlaying } from './services/iqomahService';
import { Coordinates, PrayerApiResponse, InspirationContent, LocationResult } from './types';

// Audio Sources
const ADHAN_FAJR_URL = '/Adzan_Subuh_Merdu.mp3';
const ADHAN_GENERAL_URL = '/Adzan_Mekkah_Versi_Full.mp3';
const REQUIRED_PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const PRAYER_LABELS: Record<(typeof REQUIRED_PRAYER_NAMES)[number], string> = {
  Fajr: 'Subuh',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};
// Alarm iqomah mulai berbunyi 10 detik terakhir sebelum countdown habis
const IQOMAH_PRE_ALARM_MS = 10 * 1000;
// Wording "Waktunya Iqomah" tampil singkat (sisa alarm setelah countdown habis), lalu kembali ke jam
const IQOMAH_DISPLAY_MS = 10 * 1000;
const ALARM_WINDOW_MS = 90 * 1000;

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerApiResponse | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);
  const [inspiration, setInspiration] = useState<InspirationContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingInspiration, setLoadingInspiration] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAudioHint, setShowAudioHint] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false); // Track user interaction
  const [iqomahMinutes, setIqomahMinutesState] = useState<IqomahMinutes>(() => getIqomahMinutes());
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [alarmPlaying, setAlarmPlaying] = useState<boolean>(() => isAlarmPlaying());

  // Audio State
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    // Sinkron dengan preferensi tersimpan: bila adzan tersimpan aktif, tombol tampil "On"
    return localStorage.getItem('waqt_notifications_enabled') !== 'true';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<string | null>(null);
  const adzanCooldownRef = useRef<number>(0);
  const firedAlarmsRef = useRef<Record<string, { adzan?: boolean; iqomah?: boolean }>>({});

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal durasi iqomah (dibuka dari tombol header)
  const [isIqomahModalOpen, setIsIqomahModalOpen] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('waqt_notifications_enabled');
    return saved === 'true';
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (isNotificationSupported()) {
      return getNotificationPermission();
    }
    return 'denied';
  });

  // Turunkan fase iqomah langsung dari waktu sholat hari ini agar aman setelah reload.
  const iqomahStatus: {
    phase: IqomahPhase;
    activePrayerName: string | null;
    msLeft: number | null;
  } = (() => {
    if (!prayerData) {
      return { phase: 'idle', activePrayerName: null, msLeft: null };
    }

    let relevantPrayer: {
      phase: IqomahPhase;
      activePrayerName: string;
      msLeft: number | null;
      prayerTimeMs: number;
    } | null = null;
    const now = new Date(nowMs);

    for (const prayerName of REQUIRED_PRAYER_NAMES) {
      const cleanTime = prayerData.data.timings[prayerName].split(' ')[0];
      const prayerDate = computeIqomahTarget(cleanTime, 0, now);
      const iqomahTarget = computeIqomahTarget(cleanTime, iqomahMinutes, now);

      if (!prayerDate || !iqomahTarget) {
        continue;
      }

      const prayerTimeMs = prayerDate.getTime();
      const iqomahTargetMs = iqomahTarget.getTime();
      let phase: IqomahPhase | null = null;
      let msLeft: number | null = null;

      if (nowMs >= prayerTimeMs && nowMs < iqomahTargetMs) {
        phase = 'counting';
        msLeft = iqomahTargetMs - nowMs;
      } else if (nowMs >= iqomahTargetMs && nowMs < iqomahTargetMs + IQOMAH_DISPLAY_MS) {
        phase = 'iqomah';
        msLeft = 0;
      }

      if (phase && (!relevantPrayer || prayerTimeMs > relevantPrayer.prayerTimeMs)) {
        relevantPrayer = {
          phase,
          activePrayerName: PRAYER_LABELS[prayerName],
          msLeft,
          prayerTimeMs,
        };
      }
    }

    return relevantPrayer
      ? {
        phase: relevantPrayer.phase,
        activePrayerName: relevantPrayer.activePrayerName,
        msLeft: relevantPrayer.msLeft,
      }
      : { phase: 'idle', activePrayerName: null, msLeft: null };
  })();

  const handleIqomahMinutesChange = (minutes: number): void => {
    if (!IQOMAH_OPTIONS.includes(minutes as IqomahMinutes)) {
      return;
    }

    const validMinutes = minutes as IqomahMinutes;
    setIqomahMinutesState(validMinutes);
    setIqomahMinutes(validMinutes);
  };

  const handleStopAlarm = (): void => {
    stopAlarm();
    setAlarmPlaying(false);
  };

  // Fallback to Monas, Jakarta if geolocation fails
  const DEFAULT_COORDS = { latitude: -6.1751, longitude: 106.8650, locationName: "Jakarta Pusat" };
  const STORAGE_KEY = 'waqt_location';

  const fetchInspiration = useCallback(async (prayerName: string) => {
    setLoadingInspiration(true);
    const data = await getDailyInspiration(prayerName);
    setInspiration(data);
    setLoadingInspiration(false);
  }, []);

  const fetchData = useCallback(async (coordinates: Coordinates) => {
    setLoading(true);
    setError(null);

    const data = await getPrayerTimes(coordinates);
    if (data) {
      setPrayerData(data);
      const next = getNextPrayer(data.data.timings);
      setNextPrayer(next);

      if (next) {
        fetchInspiration(next.name);
      } else {
        fetchInspiration("General");
      }
    } else {
      setError("Gagal mengambil data jadwal sholat.");
    }
    setLoading(false);
  }, [fetchInspiration]);

  // Initial Load with LocalStorage Check
  useEffect(() => {
    // 1. Cek LocalStorage dulu
    const savedLocation = localStorage.getItem(STORAGE_KEY);
    if (savedLocation) {
      try {
        const parsedCoords = JSON.parse(savedLocation);
        setCoords(parsedCoords);
        fetchData(parsedCoords);
        return; // Stop di sini kalau ada data tersimpan
      } catch (e) {
        console.error("Gagal parse lokasi tersimpan:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. Kalau tidak ada, baru coba Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          // Jangan simpan ke localStorage otomatis biar user punya opsi 'pulang' ke lokasi asli saat clear cache/reset
          setCoords(currentCoords);
          fetchData(currentCoords);
        },
        (err) => {
          console.warn("Geolocation denied/error", err);
          setCoords(DEFAULT_COORDS);
          fetchData(DEFAULT_COORDS);
          setError("Lokasi tidak terdeteksi. Menggunakan lokasi default.");
        }
      );
    } else {
      setCoords(DEFAULT_COORDS);
      fetchData(DEFAULT_COORDS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer for Next Prayer & Adhan Check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNowMs(now.getTime());
      if (!prayerData) {
        setAlarmPlaying(isAlarmPlaying());
        return;
      }

      // Update Next Prayer Countdown
      const next = getNextPrayer(prayerData.data.timings);
      setNextPrayer(next);

      // --- ADHAN LOGIC ---
      // Gunakan format manual agar konsisten (HH:mm) di semua browser/device
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;

      // Debug log setiap menit ke-0 detik untuk memastikan waktu sesuai
      if (now.getSeconds() === 0) {
        console.log(`[Timer] Current: ${currentTimeStr}, Checking against prayers...`);
      }

      // Check if current time matches any prayer time
      // PENTING: Cek detik == 0 agar trigger hanya SEKALI di awal menit
      // Jika tidak dicek detiknya, kode ini akan jalan 60x dalam 1 menit, berisiko race condition
      if (now.getSeconds() === 0) {

        // --- AUTO REFRESH DATA MIDNIGHT ---
        // Jika sudah jam 00:00, refresh data untuk hari baru
        // Service akan otomatis cek cache: 
        // - Kalau masih bulan yang sama -> Ambil dari cache (Instant)
        // - Kalau ganti bulan -> Fetch API baru
        if (hours === '00' && minutes === '00' && coords) {
          console.log("[System] New Day Detected. Refreshing prayer data...");
          fetchData(coords);
        }

        Object.entries(prayerData.data.timings).forEach(([name, time]) => {
          // Clean time string from API (sometimes it has timezone info like "04:30 (WIB)")
          const cleanTime = (time as string).split(' ')[0];

          if (cleanTime === currentTimeStr) {
            if (lastPlayedRef.current === `${name}-${cleanTime}`) return;

            const now = Date.now();
            if (now - adzanCooldownRef.current < 30000) {
              console.log(`[App] Skipping adzan for ${name} - cooldown active`);
              return;
            }
            adzanCooldownRef.current = now;

            const allowedPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            if (!allowedPrayers.includes(name)) return;

            if (!isMuted && audioRef.current) {
              console.log(`Triggering Adhan for ${name}`);

              // Select Audio Source
              const audioSrc = name === 'Fajr' ? ADHAN_FAJR_URL : ADHAN_GENERAL_URL;

              // Cek apakah source berubah sebelum set
              if (audioRef.current.src !== audioSrc && !audioRef.current.src.endsWith(audioSrc)) {
                audioRef.current.src = audioSrc;
                audioRef.current.load(); // Wajib load ulang saat ganti src
              }

              const playPromise = audioRef.current.play();

              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                    console.log(`Adhan playing: ${name}`);
                  })
                  .catch(error => {
                    console.error("Audio playback failed:", error);
                    // Fallback log atau UI feedback jika perlu
                  });
              }

              lastPlayedRef.current = `${name}-${cleanTime}`;
            }
          }
        });
      }

      // Putar alarm hanya di sekitar waktu kejadian agar tidak berbunyi basi setelah reload.
      REQUIRED_PRAYER_NAMES.forEach((prayerName) => {
        const cleanTime = prayerData.data.timings[prayerName].split(' ')[0];
        const prayerDate = computeIqomahTarget(cleanTime, 0, now);
        const iqomahTarget = computeIqomahTarget(cleanTime, iqomahMinutes, now);

        if (!prayerDate || !iqomahTarget) {
          return;
        }

        const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${prayerName}`;
        const fired = firedAlarmsRef.current[dateKey] ?? {};
        firedAlarmsRef.current[dateKey] = fired;

        // Alarm tidak boleh berbunyi lebih awal; window hanya toleransi tick yang terlambat.
        if (
          isMuted &&
          !fired.adzan &&
          now.getTime() >= prayerDate.getTime() &&
          now.getTime() - prayerDate.getTime() <= ALARM_WINDOW_MS
        ) {
          fired.adzan = true;
          playAlarm('adzan-manual');
        }

        const iqomahAlarmAt = iqomahTarget.getTime() - IQOMAH_PRE_ALARM_MS;
        if (
          !fired.iqomah &&
          now.getTime() >= iqomahAlarmAt &&
          now.getTime() - iqomahAlarmAt <= ALARM_WINDOW_MS
        ) {
          fired.iqomah = true;
          playAlarm('iqomah');
        }
      });

      setAlarmPlaying(isAlarmPlaying());

    }, 1000); // Check every second for precision

    return () => clearInterval(interval);
  }, [prayerData, isMuted, iqomahMinutes]);

  // Buka kunci Web Audio pada interaksi pertama pengguna.
  useEffect(() => {
    const handlePointerDown = (): void => {
      unlockAlarmAudio();
      window.removeEventListener('pointerdown', handlePointerDown);
    };

    window.addEventListener('pointerdown', handlePointerDown, { once: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Hint Timer
  useEffect(() => {
    // Show hint if user hasn't interacted yet
    if (!userInteracted) {
      const timer = setTimeout(() => {
        setShowAudioHint(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userInteracted]);

  // Handle first user interaction to unlock audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        // Silent play to unlock audio context
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
          }).catch(() => { }); // Ignore error on silent unlock
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [userInteracted]);

  // Inspiration Auto-Refresh Timer (30 minutes)
  useEffect(() => {
    // Initial fetch handled by fetchData -> fetchInspiration

    const interval = setInterval(() => {
      // Pass "General" or current prayer context if needed, though API is random
      fetchInspiration("General");
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchInspiration]);

  useEffect(() => {
    initNotifications();

    if (prayerData && notificationsEnabled && notificationPermission === 'granted') {
      const timings = prayerData.data.timings;
      schedulePrayerNotifications(timings as Record<string, string>)
        .then(() => console.log('[App] Notifications scheduled'))
        .catch(err => console.error('[App] Failed to schedule notifications:', err));
    }

    return () => {
      if (notificationsEnabled) {
        clearAllNotifications();
      }
    };
  }, [prayerData, notificationsEnabled, notificationPermission]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  const toggleMute = async () => {
    unlockAlarmAudio();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setShowAudioHint(false);

    if (audioRef.current) {
      if (newMutedState) {
        audioRef.current.load();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }

    if (!newMutedState && !notificationsEnabled) {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('waqt_notifications_enabled', 'true');

        if (prayerData) {
          const timings = prayerData.data.timings;
          await schedulePrayerNotifications(timings as Record<string, string>);
        }
      }
    } else if (newMutedState && notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('waqt_notifications_enabled', 'false');
      await clearAllNotifications();
    }
  };

  // Search Handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const selectLocation = (result: LocationResult) => {
    const newCoords = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      locationName: result.display_name.split(',')[0]
    };

    // Simpan ke LocalStorage agar persisten
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCoords));

    setCoords(newCoords);
    fetchData(newCoords);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative selection:bg-sky-500/30 flex flex-col overflow-x-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} className="hidden" />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 opacity-80" />
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Container melebar bertahap: mobile sempit → tablet → laptop → Smart TV (90rem),
          plus padding proporsional sebagai safe area layar TV */}
      <div className="relative z-10 mx-auto w-full max-w-md sm:max-w-2xl lg:max-w-6xl 2xl:max-w-[90rem] px-3 sm:px-6 lg:px-10 py-3 sm:py-4 min-h-screen flex flex-col">

        {/* Header Section - Responsive padding
            Mobile: 2 baris rapat (brand, lalu semua kontrol dalam SATU baris yang boleh wrap)
            — menghemat tinggi viewport mobile portrait.
            Desktop (sm+): susunan menyamping, tidak berubah. */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4 gap-2 sm:gap-4 shrink-0">
          {/* Baris brand: logo + wordmark + subjudul */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Navigation className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white leading-tight">Alsala</h1>
              <p className="text-[10px] sm:text-xs lg:text-sm text-sky-200/70 font-medium tracking-wider">JADWAL SHOLAT DIGITAL</p>
            </div>
          </div>

          {/* Baris kontrol: Adzan + Iqomah + lokasi/Ubah + Hijriah dalam SATU baris (boleh wrap),
              bukan baris-baris center terpisah; target sentuh minimal ~36px di mobile */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-3">
            {/* Volume Control */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Adzan otomatis nonaktif — alarm pengingat adzan akan berbunyi di waktu sholat" : "Adzan otomatis aktif — alarm pengingat adzan tidak berbunyi"}
              aria-label={isMuted ? "Adzan otomatis nonaktif — alarm pengingat adzan akan berbunyi di waktu sholat" : "Adzan otomatis aktif — alarm pengingat adzan tidak berbunyi"}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1 min-h-[2.25rem] sm:min-h-0 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-xs lg:text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${isMuted
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                } ${isPlaying ? 'animate-pulse ring-1 ring-green-400' : ''}`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">{isMuted ? "Adzan Otomatis Off" : isPlaying ? "Adzan Berkumandang" : "Adzan Otomatis On"}</span>
              <span className="sm:hidden">{isMuted ? "Adzan Off" : "Adzan On"}</span>
            </button>

            {/* Tombol durasi iqomah — buka modal pemilihan durasi */}
            <button
              onClick={() => setIsIqomahModalOpen(true)}
              title="Durasi Iqomah"
              aria-label="Ubah durasi iqomah"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1 min-h-[2.25rem] sm:min-h-0 sm:py-1.5 lg:py-2 rounded-full text-[10px] sm:text-xs lg:text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Iqomah {iqomahMinutes} menit</span>
              <span className="sm:hidden">Iqomah</span>
            </button>

            {!isMuted && notificationPermission === 'granted' && (
              <div className="flex items-center gap-1 px-2 py-1 min-h-[2.25rem] sm:min-h-0 rounded-full text-[10px] bg-sky-500/20 text-sky-300" title={notificationsEnabled ? "Notifikasi aktif" : "Notifikasi nonaktif"}>
                {notificationsEnabled ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
              </div>
            )}

            {/* Tombol lokasi + pill tanggal Hijriah: bergerombol rapat dalam baris kontrol */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 min-h-[2.25rem] sm:min-h-0 sm:px-0 text-sky-300 text-xs sm:text-sm lg:text-base hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded group cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:animate-bounce" />
                <span className="truncate max-w-[130px] sm:max-w-[200px] xl:max-w-[280px]">
                  {coords?.locationName || prayerData?.data.meta.timezone || "Cari Lokasi..."}
                </span>
                <span className="text-[10px] sm:text-xs bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-sky-200">Ubah</span>
              </button>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 bg-white/5 py-0.5 sm:py-1 px-2 sm:px-3 rounded-full inline-flex items-center min-h-[1.5rem] backdrop-blur-sm">
                {prayerData?.data.date.hijri.day} {prayerData?.data.date.hijri.month.en} {prayerData?.data.date.hijri.year}
              </p>
            </div>
          </div>
        </header>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden mt-4 sm:mt-0 mx-auto">
              <div className="p-3 sm:p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-semibold text-sm sm:text-base">Ganti Lokasi</h3>
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Cari kota (misal: Bandung, Tokyo)"
                    className="w-full bg-slate-950 text-white border border-white/10 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-20 sm:pr-24 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-3 top-3 sm:top-3.5" />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 top-2 bg-sky-600 hover:bg-sky-500 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
                  </button>
                </form>

                <div className="mt-3 sm:mt-4 max-h-[250px] sm:max-h-[300px] overflow-y-auto space-y-1.5 sm:space-y-2 custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        onClick={() => selectLocation(result)}
                        className="w-full text-left p-2.5 sm:p-3 rounded-lg hover:bg-white/5 flex items-center gap-2 sm:gap-3 transition-colors group"
                      >
                        <div className="bg-white/5 p-1.5 sm:p-2 rounded-full text-gray-400 group-hover:text-sky-400 group-hover:bg-sky-500/10 shrink-0">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white truncate">
                          {result.display_name}
                        </span>
                      </button>
                    ))
                  ) : (
                    !isSearching && searchQuery && <p className="text-center text-gray-500 text-xs sm:text-sm py-4">Tidak ada hasil ditemukan.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Durasi Iqomah — tutup via X, klik backdrop, atau tombol Escape */}
        {isIqomahModalOpen && (
          <IqomahDurationModal
            minutes={iqomahMinutes}
            onMinutesChange={handleIqomahMinutesChange}
            onClose={() => setIsIqomahModalOpen(false)}
          />
        )}

        {/* Main Content Area — mobile satu kolom (Jam → Waktu Shalat → Inspirasi),
            landscape/deskop lg+: grid dua kolom proporsional (kiri: jam + Menuju Waktu + footage,
            kanan: Waktu Shalat + Inspirasi) tanpa pita kosong kiri-kanan.
            items-stretch supaya kolom kiri bisa tumbuh dan footage rata bawah dengan kolom kanan */}
        <main className="flex-grow w-full flex flex-col items-center lg:grid lg:grid-cols-12 lg:items-stretch gap-3 sm:gap-4 lg:gap-6 2xl:gap-8 py-2 sm:py-4 content-start">

          {/* Kolom kiri: jam / countdown iqomah + Menuju Waktu */}
          <div className="w-full max-w-md sm:max-w-2xl lg:max-w-none mx-auto flex flex-col gap-3 sm:gap-4 lg:col-span-5 lg:row-start-1">

            {/* Area jam — tinggi tercadang agar pergantian phase iqomah tidak menggeser layout */}
            <div className="relative w-full min-h-[7rem] sm:min-h-[8.5rem] lg:min-h-[11rem] xl:min-h-[12.5rem]">
              {/* Layer jam normal: hanya saat phase idle (desain lama, tidak diubah) */}
              <div className={`absolute inset-0 flex items-center justify-center ${iqomahStatus.phase !== 'idle' ? 'hidden' : ''}`}>
                <Clock />
              </div>

              {/* Layer hitung mundur: menggantikan jam pada phase counting/iqomah */}
              {iqomahStatus.phase !== 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <IqomahCountdownDisplay
                    phase={iqomahStatus.phase}
                    activePrayerName={iqomahStatus.activePrayerName}
                    msLeft={iqomahStatus.msLeft}
                    adzanReminder={isMuted}
                    alarmPlaying={alarmPlaying}
                    onStopAlarm={handleStopAlarm}
                  />
                </div>
              )}
            </div>

            {nextPrayer && (
              <div className="text-center animate-fade-in-up">
                <p className="text-slate-200 text-xs sm:text-sm uppercase tracking-widest mb-1">Menuju Waktu</p>
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full backdrop-blur-sm">
                  {/* Nama waktu memakai label Indonesia yang konsisten (Subuh/Dzuhur/Ashar/Maghrib/Isya) */}
                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-sky-400">
                    {PRAYER_LABELS[nextPrayer.name as keyof typeof PRAYER_LABELS] ?? nextPrayer.name}
                  </span>
                  <span className="w-px h-4 sm:h-5 lg:h-6 bg-white/10"></span>
                  <span className="text-sm sm:text-lg lg:text-2xl font-mono text-white">{nextPrayer.time}</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm lg:text-base font-medium mt-1">
                  {Math.floor(nextPrayer.diffMs / 3600000)}j {Math.floor((nextPrayer.diffMs % 3600000) / 60000)}m lagi
                </p>
              </div>
            )}

            {/* Footage Makkah — di bawah blok Menuju Waktu; di lg+ mengisi sisa tinggi
                  kolom kiri hingga rata bawah dengan kartu Inspirasi di kolom kanan */}
            <section className="w-full flex lg:flex-1 lg:min-h-0">
              <PrayerFootage timings={prayerData?.data.timings} nowMs={nowMs} />
            </section>
          </div>

          {/* Kolom kanan: Waktu Shalat + Inspirasi Harian */}
          <div className="w-full max-w-md sm:max-w-2xl lg:max-w-none mx-auto flex flex-col gap-3 sm:gap-4 lg:col-span-7 lg:row-start-1">

            {/* Waktu Shalat */}
            <section className="w-full">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 sm:h-24 lg:h-32 bg-white/5 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : prayerData ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <PrayerList
                    timings={prayerData.data.timings}
                    nextPrayer={nextPrayer?.name || ''}
                  />
                </div>
              ) : (
                <div className="text-center p-6 sm:p-10 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-red-400 text-sm">{error || "Data tidak tersedia."}</p>
                  <button
                    onClick={() => coords && fetchData(coords)}
                    className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Coba Lagi
                  </button>
                </div>
              )}
            </section>

            {/* Inspirasi harian — selalu di bawah daftar waktu shalat, satu render untuk semua breakpoint */}
            <section className="w-full">
              <InspirationCard content={inspiration} loading={loadingInspiration} />
            </section>

          </div>

        </main>

        <footer className="mt-auto text-center text-slate-600 text-[10px] sm:text-xs py-2 sm:py-3 border-t border-white/5 shrink-0">
          <p>
            &copy; {new Date().getFullYear()} Made with {' '}
            {/* Ikon hati SVG (bukan emoji) agar tampil konsisten di semua perangkat, termasuk Windows */}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="inline-block w-3 h-3 text-red-500 align-[-0.125em]"
            >
              <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            {' '}
            by <a href="https://trazmedia.com" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">Trazmedia Segoro Digital</a>
          </p>
        </footer>

        {/* Audio Hint Toast - Responsive */}
        {showAudioHint && isMuted && (
          <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700 flex justify-center sm:block">
            <div className="bg-slate-800/90 backdrop-blur border border-sky-500/30 text-sky-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl shadow-sky-500/10 flex items-start gap-3 sm:gap-4 w-full max-w-sm">
              <div className="bg-sky-500/20 p-2 sm:p-2.5 rounded-full text-sky-400 shrink-0">
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-0.5 sm:mb-1 text-sm">Aktifkan Suara Adzan?</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Klik tombol audio untuk mengaktifkan suara Adzan otomatis.
                </p>
              </div>
              <button
                onClick={() => setShowAudioHint(false)}
                className="text-slate-500 hover:text-white transition-colors -mr-1 -mt-1 p-1"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
