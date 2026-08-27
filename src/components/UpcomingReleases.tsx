import React from 'react';
import { Calendar, Bell, Clock, Tv, Film, Play, Star, Check } from 'lucide-react';
import { Movie } from '../types';

interface UpcomingReleasesProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleAlert: (movie: Movie) => void;
  subscribedMovieIds: string[];
}

export const UpcomingReleases: React.FC<UpcomingReleasesProps> = ({
  movies,
  onSelectMovie,
  onToggleAlert,
  subscribedMovieIds
}) => {
  const upcomingTitles = movies.filter(m => m.upcomingEpisode || m.year >= 2024);

  const calculateDaysRemaining = (dateString?: string): string => {
    if (!dateString) return 'Coming Soon';
    const target = new Date(dateString).getTime();
    const now = new Date('2026-08-27').getTime(); // Current mock reference date
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Available Now!';
    if (diffDays === 1) return 'Tomorrow!';
    return `In ${diffDays} days`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            Release Radar & Episode Drops
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Upcoming Show Episodes & Premiere Alerts
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Never miss a season premiere. Subscribe to push alerts to get notified the second new episodes air on streaming services.
          </p>
        </div>
      </div>

      {/* Release Timeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingTitles.map((movie) => {
          const isSubscribed = subscribedMovieIds.includes(movie.id);
          const daysLeft = calculateDaysRemaining(movie.upcomingEpisode?.airDate);

          return (
            <div
              key={movie.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex gap-4">
                  {/* Poster */}
                  <div
                    onClick={() => onSelectMovie(movie)}
                    className="w-20 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 bg-slate-950 shadow border border-slate-800"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] uppercase font-bold border border-rose-500/30">
                        {movie.type}
                      </span>
                      <span className="text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        {daysLeft}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectMovie(movie)}
                      className="text-base font-bold text-white hover:text-rose-400 cursor-pointer mt-1 truncate"
                    >
                      {movie.title}
                    </h3>

                    {movie.upcomingEpisode ? (
                      <div className="mt-1.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                        <div className="text-xs font-bold text-rose-200 truncate">
                          S{movie.upcomingEpisode.season} E{movie.upcomingEpisode.episode}: "{movie.upcomingEpisode.title}"
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>Air Date: <strong>{movie.upcomingEpisode.airDate}</strong></span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {movie.overview}
                      </p>
                    )}
                  </div>
                </div>

                {/* Streaming Availability */}
                {movie.streamingOn && movie.streamingOn.length > 0 && (
                  <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <span>Airing on:</span>
                    {movie.streamingOn.map(s => (
                      <span key={s.name} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200">
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectMovie(movie)}
                  className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => onToggleAlert(movie)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSubscribed
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                  }`}
                >
                  {isSubscribed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{isSubscribed ? 'Alert Subscribed' : 'Set Push Alert'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
