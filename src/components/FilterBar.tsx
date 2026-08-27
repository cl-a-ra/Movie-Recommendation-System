import React from 'react';
import { SlidersHorizontal, Star, Sparkles, Film, Tv, RotateCcw } from 'lucide-react';
import { MediaType } from '../types';

interface FilterBarProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedMood: string;
  setSelectedMood: (mood: string) => void;
  selectedStreaming: string;
  setSelectedStreaming: (streaming: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenre,
  setSelectedGenre,
  selectedMood,
  setSelectedMood,
  selectedStreaming,
  setSelectedStreaming,
  selectedType,
  setSelectedType,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  onResetFilters
}) => {
  const genres = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Drama', 'Crime', 'Animation', 'Comedy', 'Adventure', 'Fantasy', 'Horror', 'Mystery'];
  const moods = ['All', 'Mind-Bending', 'Dark Thriller', 'Feel-Good', 'Emotional', 'Epic', 'Adrenaline', 'Moody', 'Dystopian'];
  const streamingServices = ['All', 'Netflix', 'Max', 'Prime Video', 'Apple TV+', 'Hulu', 'Paramount+'];

  const hasActiveFilters = selectedGenre !== 'All' || selectedMood !== 'All' || selectedStreaming !== 'All' || selectedType !== 'all' || minRating > 0 || sortBy !== 'match';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
      
      {/* Top Row: Media Type & Sorting & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Media Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedType === 'all' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Titles
          </button>
          <button
            onClick={() => setSelectedType('movie')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              selectedType === 'movie' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Movies
          </button>
          <button
            onClick={() => setSelectedType('series')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              selectedType === 'series' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            TV Shows
          </button>
        </div>

        {/* Right side: Minimum Rating & Sort order */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          
          {/* Min Rating */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900">Any Rating</option>
              <option value={8.5} className="bg-slate-900">8.5+ ⭐ Masterpieces</option>
              <option value={8.0} className="bg-slate-900">8.0+ ⭐ Highly Rated</option>
              <option value={7.5} className="bg-slate-900">7.5+ ⭐ Good Watches</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="match" className="bg-slate-900">✨ Best Match Score</option>
              <option value="rating" className="bg-slate-900">⭐ Highest Rated</option>
              <option value="popular" className="bg-slate-900">🔥 Most Popular</option>
              <option value="year" className="bg-slate-900">📅 Release Year</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Genre Pills */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Filter by Genre:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Vibes & Streaming Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
        
        {/* Mood Tags */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Vibes & Mood Filter:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-2.5 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedMood === mood
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-amber-300 border border-slate-800'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Streaming Services */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Streaming Platform:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
            {streamingServices.map(srv => (
              <button
                key={srv}
                onClick={() => setSelectedStreaming(srv)}
                className={`px-2.5 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedStreaming === srv
                    ? 'bg-slate-200 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
