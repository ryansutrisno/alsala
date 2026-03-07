import { Sparkles } from 'lucide-react';
import React from 'react';
import { InspirationContent } from '../types';

interface InspirationCardProps {
  content: InspirationContent | null;
  loading: boolean;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ content, loading }) => {
  return (
    <div className="w-full bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-md relative overflow-hidden group">

      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700" />

      <div className="flex items-center gap-2 mb-3 sm:mb-4 text-purple-300">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Inspirasi Harian</span>
      </div>

      {loading ? (
        <div className="space-y-2 sm:space-y-3 animate-pulse">
          <div className="h-3 sm:h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 sm:h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ) : content ? (
        <div className="space-y-3 sm:space-y-4">
          <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif text-white leading-relaxed italic">
            "{content.quote}"
          </blockquote>
          
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2 sm:gap-4 border-t border-white/10 pt-3 sm:pt-4">
            <div className="flex items-center gap-2 text-sky-400 text-xs sm:text-sm font-medium whitespace-nowrap bg-sky-500/10 px-2 sm:px-3 py-1 rounded-full">
              <span>{content.source}</span>
            </div>
          </div>
          
          {content.reflection && (
             <div className="mt-2 text-xs sm:text-sm text-gray-400 border-l-2 border-purple-500/30 pl-3">
               {content.reflection}
             </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Gagal memuat inspirasi.</p>
      )}
    </div>
  );
};

export default InspirationCard;
