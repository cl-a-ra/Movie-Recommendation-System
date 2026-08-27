import React, { useState } from 'react';
import { 
  Bookmark, CheckCircle, Clock, Heart, Plus, Trash2, 
  Star, Film, Tv, SlidersHorizontal, Edit3, Sparkles
} from 'lucide-react';
import { Movie, WatchlistItem, WatchlistStatus, UserProfile } from '../types';

interface WatchlistManagerProps {
  watchlist: WatchlistItem[];
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onUpdateWatchlist: (movieId: string, status: WatchlistStatus, progress?: number, notes?: string, customLists?: string[]) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  userProfile: UserProfile;
  onAddCustomList: (listName: string) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  watchlist,
  movies,
  onSelectMovie,
  onUpdateWatchlist,
  onRemoveFromWatchlist,
  userProfile,
  onAddCustomList
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [editingNotesMovieId, setEditingNotesMovieId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Combine watchlist items with their full movie details
  const enrichedWatchlist = watchlist.map(item => {
    const movie = movies.find(m => m.id === item.movieId);
    return { item, movie };
  }).filter((entry): entry is { item: WatchlistItem; movie: Movie } => Boolean(entry.movie));

  // Filter based on tab and media type
  const filteredList = enrichedWatchlist.filter(({ item, movie }) => {
    if (selectedStatusTab === 'want_to_watch' && item.status !== 'want_to_watch') return false;
    if (selectedStatusTab === 'watching' && item.status !== 'watching') return false;
    if (selectedStatusTab === 'completed' && item.status !== 'completed') return false;
    if (selectedStatusTab === 'favorites' && item.status !== 'favorites') return false;
    if (selectedStatusTab.startsWith('custom:')) {
      const customName = selectedStatusTab.replace('custom:', '');
      if (!item.customLists?.includes(customName)) return false;
    }
    if (typeFilter !== 'all' && movie.type !== typeFilter) return false;
    return true;
  });

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onAddCustomList(newListName.trim());
    setSelectedStatusTab(`custom:${newListName.trim()}`);
    setNewListName('');
    setIsCreatingList(false);
  };

  const startEditNotes = (movieId: string, currentNotes: string = '') => {
    setEditingNotesMovieId(movieId);
    setTempNotes(currentNotes);
  };

  const saveNotes = (item: WatchlistItem) => {
    onUpdateWatchlist(item.movieId, item.status, item.progressPercent, tempNotes, item.customLists);
    setEditingNotesMovieId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Watchlist Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            Personalized Collection
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Your Movie & Show Watchlists
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Keep track of upcoming weekend watches, monitor season progress, and organize your favorite cinema discoveries.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-lg font-black text-rose-400">{watchlist.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Saved</div>
          </div>
          <div className="text-center px-3 border-r border-slate-800">
            <div className="text-lg font-black text-emerald-400">
              {watchlist.filter(w => w.status === 'completed').length}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Finished</div>
          </div>
          <div className="text-center px-3">
            <div className="text-lg font-black text-amber-400">
              {watchlist.filter(w => w.status === 'favorites').length}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Favorites</div>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        
        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'want_to_watch', label: 'Want to Watch' },
            { id: 'watching', label: 'Currently Watching' },
            { id: 'completed', label: 'Completed' },
            { id: 'favorites', label: 'Favorites' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedStatusTab === tab.id
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* User's Custom Collections */}
          {userProfile.customLists?.map(customName => (
            <button
              key={customName}
              onClick={() => setSelectedStatusTab(`custom:${customName}`)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedStatusTab === `custom:${customName}`
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-amber-300 border border-slate-800'
              }`}
            >
              📁 {customName}
            </button>
          ))}

          {/* Create Custom List Button */}
          <button
            onClick={() => setIsCreatingList(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New List</span>
          </button>
        </div>

        {/* Media Type Filter (All / Movies / Series) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              typeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('movie')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              typeFilter === 'movie' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3 h-3" />
            Movies
          </button>
          <button
            onClick={() => setTypeFilter('series')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              typeFilter === 'series' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3 h-3" />
            Series
          </button>
        </div>
      </div>

      {/* New Custom List Modal / Popover */}
      {isCreatingList && (
        <form onSubmit={handleCreateList} className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-3 max-w-md animate-in fade-in">
          <input
            type="text"
            placeholder="e.g. Rainy Day Horror, Studio Ghibli, 90s Thrillers"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingList(false)}
            className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Watchlist Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No titles in this list yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the Discover tab or use the AI Mood Matcher to add exciting movies and TV shows to your watchlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map(({ item, movie }) => (
            <div
              key={item.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-all"
            >
              {/* Poster */}
              <div 
                onClick={() => onSelectMovie(movie)}
                className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 bg-slate-950"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 
                        onClick={() => onSelectMovie(movie)}
                        className="text-sm font-bold text-white hover:text-rose-400 cursor-pointer truncate"
                      >
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span className="capitalize">{movie.type}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">⭐ {movie.rating}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(movie.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateWatchlist(movie.id, e.target.value as WatchlistStatus, item.progressPercent, item.personalNotes, item.customLists)}
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="want_to_watch">Want to Watch</option>
                      <option value="watching">Currently Watching</option>
                      <option value="completed">Completed</option>
                      <option value="favorites">Favorite ⭐</option>
                    </select>

                    {/* Progress slider if currently watching */}
                    {item.status === 'watching' && (
                      <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.progressPercent || 0}
                          onChange={(e) => onUpdateWatchlist(movie.id, item.status, Number(e.target.value), item.personalNotes, item.customLists)}
                          className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <span className="text-[11px] font-bold text-rose-400 whitespace-nowrap">
                          {item.progressPercent || 0}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Personal Notes */}
                  <div className="mt-2.5">
                    {editingNotesMovieId === movie.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Add personal thoughts or episode timestamp..."
                          className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                        />
                        <button
                          onClick={() => saveNotes(item)}
                          className="px-2 py-1 bg-rose-600 text-white text-xs rounded-lg font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => startEditNotes(movie.id, item.personalNotes)}
                        className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1.5 italic truncate"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>{item.personalNotes || 'Add personal note / progress tracker...'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom List badges */}
                {item.customLists && item.customLists.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 flex-wrap">
                    {item.customLists.map(cl => (
                      <span key={cl} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20">
                        📁 {cl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
