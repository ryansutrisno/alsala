import React, { useEffect } from 'react';
import { Timer, X } from 'lucide-react';
import { IQOMAH_OPTIONS } from '../services/iqomahService';

interface IqomahDurationModalProps {
  minutes: number;                          // durasi terpilih saat ini
  onMinutesChange: (minutes: number) => void;
  onClose: () => void;
}

// Modal pemilihan durasi iqomah — mengikuti bahasa visual modal Ganti Lokasi
// (backdrop gelap blur, panel rounded, daftar opsi sebagai tombol besar).
const IqomahDurationModal: React.FC<IqomahDurationModalProps> = ({
  minutes,
  onMinutesChange,
  onClose,
}) => {
  // Tombol Escape menutup modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const pilihDurasi = (nilai: number): void => {
    onMinutesChange(nilai);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Durasi Iqomah"
        className="bg-[#1e293b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden mt-4 sm:mt-0 mx-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Kepala modal: judul + tombol tutup */}
        <div className="p-3 sm:p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-purple-300">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="text-white font-semibold text-sm sm:text-base">Durasi Iqomah</h3>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400 hover:text-white p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daftar opsi durasi sebagai tombol besar (target sentuh/klik luas untuk TV & tablet) */}
        <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {IQOMAH_OPTIONS.map((nilai) => {
            const aktif = nilai === minutes;
            return (
              <button
                key={nilai}
                type="button"
                onClick={() => pilihDurasi(nilai)}
                aria-pressed={aktif}
                className={`
                  w-full text-center px-3 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-semibold border transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70
                  ${aktif
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                    : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                  }
                `}
              >
                {nilai} menit
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IqomahDurationModal;
