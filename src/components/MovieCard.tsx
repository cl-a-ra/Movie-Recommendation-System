import React from 'react';
import { Star, Bookmark, Bell, Share2, Play, Check } from 'lucide-react';
import { Movie, WatchlistStatus } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie, status: WatchlistStatus) => void;
  watchlistStatus?: WatchlistStatus;
  onToggleNotificationAlert?: (movie: Movie) => void;
  isNotificationSubscribed?: boolean;
  onShare: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onToggleWatchlist,
  watchlistStatus,
  onToggleNotificationAlert,
  isNotificationSubscribed,
  onShare
}) => {
  return (
    <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 hover:-translate-y-1 flex flex-col">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => onSelect(movie)} 
        className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer bg-slate-950"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          {/* Match Score */}
          {movie.matchScore ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-extrabold shadow">
              {movie.matchScore}% Match
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] uppercase font-bold border border-slate-700">
              {movie.type}
            </span>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold shadow">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Quick Play & Action Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movie);
            }}
            className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 hover:scale-110 hover:bg-rose-500 transition-all"
            title="View Details & Trailer"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Upcoming Episode Alert Ribbon (if applicable) */}
        {movie.upcomingEpisode && (
          <div className="absolute bottom-2 left-2 right-2 bg-rose-950/85 backdrop-blur-sm border border-rose-500/40 rounded-lg px-2 py-1 text-[11px] text-rose-200 flex items-center justify-between z-10">
            <span className="truncate font-medium">S{movie.upcomingEpisode.season} E{movie.upcomingEpisode.episode} Airs {movie.upcomingEpisode.airDate.slice(5)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNotificationAlert && onToggleNotificationAlert(movie);
              }}
              className={`p-1 rounded-md transition-colors ${
                isNotificationSubscribed ? 'text-emerald-400 bg-emerald-500/20' : 'text-rose-300 hover:text-white'
              }`}
              title={isNotificationSubscribed ? 'Alert Active' : 'Get Episode Push Notification'}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Year */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onSelect(movie)}
              className="text-sm font-semibold text-slate-100 hover:text-rose-400 cursor-pointer line-clamp-1 transition-colors"
              title={movie.title}
            >
              {movie.title}
            </h3>
            <span className="text-xs text-slate-400 whitespace-nowrap">{movie.year}</span>
          </div>

          {/* Genres & Moods */}
          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            {movie.genres.slice(0, 2).map((genre) => (
              <span 
                key={genre}
                className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded"
              >
                {genre}
              </span>
            ))}
            {movie.moods && movie.moods[0] && (
              <span className="text-[10px] font-medium text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                {movie.moods[0]}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie, watchlistStatus ? 'want_to_watch' : 'want_to_watch');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
                watchlistStatus
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
              title={watchlistStatus ? `Saved in Watchlist (${watchlistStatus})` : 'Add to Watchlist'}
            >
              {watchlistStatus ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{watchlistStatus ? 'Saved' : 'Watchlist'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(movie);
              }}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Share Recommendation"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
