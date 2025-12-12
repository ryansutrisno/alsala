import React from 'react';
import { InspirationContent } from '../types';
import { Sparkles, Bot } from 'lucide-react';

interface InspirationCardProps {
  content: InspirationContent | null;
  loading: boolean;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ content, loading }) => {
  return (
    <div className="w-full bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-4 text-purple-300">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Inspirasi Harian</span>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-3 bg-white/5 rounded w-1/4 mt-4"></div>
        </div>
      ) : content ? (
        <div className="space-y-4">
          <blockquote className="text-xl md:text-2xl font-serif text-white leading-relaxed italic">
            "{content.quote}"
          </blockquote>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-t border-white/10 pt-4">
             <div>
                <p className="text-sm text-gray-400">Refleksi:</p>
                <p className="text-gray-200">{content.reflection}</p>
             </div>
             <div className="flex items-center gap-2 text-sky-400 text-sm font-medium whitespace-nowrap bg-sky-500/10 px-3 py-1 rounded-full">
                <Bot className="w-4 h-4" />
                <span>{content.source}</span>
             </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Gagal memuat inspirasi.</p>
      )}
    </div>
  );
};

export default InspirationCard;
