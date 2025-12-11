import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, RefreshCw, Search, X, Loader2 } from 'lucide-react';
import Clock from './components/Clock';
import PrayerList from './components/PrayerList';
import InspirationCard from './components/InspirationCard';
import { getPrayerTimes, getNextPrayer, searchLocation } from './services/prayerService';
import { getDailyInspiration } from './services/quoteService';
import { Coordinates, PrayerApiResponse, InspirationContent, LocationResult } from './types';

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerApiResponse | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number } | null>(null);
  const [inspiration, setInspiration] = useState<InspirationContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingInspiration, setLoadingInspiration] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fallback to Monas, Jakarta if geolocation fails
  const DEFAULT_COORDS = { latitude: -6.1751, longitude: 106.8650, locationName: "Jakarta Pusat" };

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
      
      // Fetch inspiration based on the *next* prayer context or current time
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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
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
  }, []); // Run once on mount

  // Update countdown every minute to refresh "Next Prayer" status
  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerData) {
        const next = getNextPrayer(prayerData.data.timings);
        setNextPrayer(next);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [prayerData]);

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
      locationName: result.display_name.split(',')[0] // Take the first part of the address (city name)
    };
    setCoords(newCoords);
    fetchData(newCoords);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-x-hidden selection:bg-sky-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 opacity-80" />
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                <Navigation className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-white">Alsala</h1>
               <p className="text-xs text-sky-200/60 font-medium tracking-wider">JADWAL SHOLAT DIGITAL</p>
             </div>
          </div>

          <div className="text-right w-full md:w-auto">
             <button 
               onClick={() => setIsSearchOpen(true)}
               className="flex items-center gap-2 justify-end text-sky-300 text-sm mb-1 ml-auto hover:text-white transition-colors group cursor-pointer"
             >
                <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                <span className="truncate max-w-[200px]">
                  {coords?.locationName || prayerData?.data.meta.timezone || "Cari Lokasi..."}
                </span>
                <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-sky-200">Ubah</span>
             </button>
             <p className="text-xs text-gray-500 bg-white/5 py-1 px-3 rounded-full inline-block backdrop-blur-sm">
                {prayerData?.data.date.hijri.day} {prayerData?.data.date.hijri.month.en} {prayerData?.data.date.hijri.year}
             </p>
          </div>
        </header>

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden mt-10 md:mt-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-white font-semibold">Ganti Lokasi</h3>
                   <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                <div className="p-4">
                   <form onSubmit={handleSearch} className="relative">
                      <input 
                        type="text" 
                        placeholder="Cari kota (misal: Bandung, Tokyo)" 
                        className="w-full bg-slate-950 text-white border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                      <button 
                        type="submit" 
                        disabled={isSearching}
                        className="absolute right-2 top-2 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50"
                      >
                         {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
                      </button>
                   </form>

                   <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <button
                            key={result.place_id}
                            onClick={() => selectLocation(result)}
                            className="w-full text-left p-3 rounded-lg hover:bg-white/5 flex items-center gap-3 transition-colors group"
                          >
                             <div className="bg-white/5 p-2 rounded-full text-gray-400 group-hover:text-sky-400 group-hover:bg-sky-500/10">
                                <MapPin className="w-4 h-4" />
                             </div>
                             <span className="text-sm text-gray-300 group-hover:text-white truncate">
                                {result.display_name}
                             </span>
                          </button>
                        ))
                      ) : (
                        !isSearching && searchQuery && <p className="text-center text-gray-500 text-sm py-4">Tidak ada hasil ditemukan.</p>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col gap-8 md:gap-12">
           
           {/* Clock & Next Prayer Status */}
           <div className="flex flex-col items-center justify-center py-4">
              <Clock />
              
              {nextPrayer && (
                <div className="mt-6 text-center animate-fade-in-up">
                   <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Menuju Waktu</p>
                   <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
                      <span className="text-2xl font-bold text-sky-400">{nextPrayer.name}</span>
                      <span className="w-px h-6 bg-white/10"></span>
                      <span className="text-xl font-mono text-white">{nextPrayer.time}</span>
                   </div>
                   <p className="text-xs text-gray-500 mt-2">
                     {Math.floor(nextPrayer.diffMs / 3600000)}j {Math.floor((nextPrayer.diffMs % 3600000) / 60000)}m lagi
                   </p>
                </div>
              )}
           </div>

           {/* Prayer Cards Grid */}
           <section className="w-full max-w-6xl mx-auto">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : prayerData ? (
                 <PrayerList 
                    timings={prayerData.data.timings} 
                    nextPrayer={nextPrayer?.name || ''} 
                 />
              ) : (
                <div className="text-center p-10 bg-red-500/10 rounded-xl border border-red-500/20">
                   <p className="text-red-400">{error || "Data tidak tersedia."}</p>
                   <button 
                      onClick={() => coords && fetchData(coords)}
                      className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                   >
                      <RefreshCw className="w-4 h-4" /> Coba Lagi
                   </button>
                </div>
              )}
           </section>

           {/* Inspiration Section (Local Data) */}
           <section className="w-full max-w-3xl mx-auto">
             <InspirationCard content={inspiration} loading={loadingInspiration} />
           </section>

        </main>

        <footer className="mt-12 text-center text-slate-600 text-sm py-4 border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} Nurul Waqt. Ditenagai oleh Aladhan API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;