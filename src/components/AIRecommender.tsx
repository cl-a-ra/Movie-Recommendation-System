import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, Film, Star, Bookmark, Play, AlertCircle } from 'lucide-react';
import { Movie, WatchlistStatus, UserProfile } from '../types';

interface AIRecommenderProps {
  userProfile: UserProfile;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie, status: WatchlistStatus) => void;
  watchlistMovieIds: string[];
}

interface AIRecResult {
  title: string;
  type: 'movie' | 'series';
  year: number;
  genres: string[];
  matchScore: number;
  pitch: string;
  moodTags: string[];
  similarTo: string;
}

export const AIRecommender: React.FC<AIRecommenderProps> = ({
  userProfile,
  allMovies,
  onSelectMovie,
  onToggleWatchlist,
  watchlistMovieIds
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState('Mind-Bending');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecResult[]>([
    {
      title: 'Arrival',
      type: 'movie',
      year: 2016,
      genres: ['Sci-Fi', 'Drama', 'Mystery'],
      matchScore: 98,
      pitch: 'A profound, emotionally resonant first-contact masterpiece with non-linear storytelling and unforgettable music.',
      moodTags: ['Mind-Bending', 'Emotional', 'Philosophical'],
      similarTo: 'Interstellar & Inception'
    },
    {
      title: 'Dark',
      type: 'series',
      year: 2017,
      genres: ['Sci-Fi', 'Mystery', 'Drama'],
      matchScore: 96,
      pitch: 'An intricate, rain-soaked puzzle-box series that rewards attentive viewing with shocking revelations.',
      moodTags: ['Dark Thriller', 'Mind-Bending', 'Moody'],
      similarTo: 'Severance & Stranger Things'
    },
    {
      title: 'Blade Runner 2049',
      type: 'movie',
      year: 2017,
      genres: ['Sci-Fi', 'Mystery', 'Drama'],
      matchScore: 94,
      pitch: 'Breathtaking visual design and atmospheric neon noir examining identity and humanity.',
      moodTags: ['Moody', 'Philosophical', 'Adrenaline'],
      similarTo: 'Dune: Part Two & The Batman'
    }
  ]);

  const presetMoods = [
    { label: 'Mind-Bending Sci-Fi', mood: 'Mind-Bending', query: 'Intricate high-concept science fiction with paradoxes and deep lore' },
    { label: 'Rainy Dark Noir', mood: 'Dark Thriller', query: 'Atmospheric neo-noir crime thriller with moody cinematography and detective intrigue' },
    { label: 'Heartwarming / Cozy', mood: 'Feel-Good', query: 'Comforting, witty adventure with emotional warmth and high replay value' },
    { label: 'Adrenaline Rush', mood: 'Adrenaline', query: 'Fast-paced relentless action with stunning stunt choreography and tension' },
    { label: 'Existential Workplace', mood: 'Dystopian', query: 'Psychological thriller set in eerie corporate structures with dark comedy' }
  ];

  const handleGenerate = async (customQuery?: string, customMood?: string) => {
    const queryToSend = customQuery || prompt;
    if (!queryToSend && !customMood) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/recommendations/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToSend,
          userGenres: userProfile.favoriteGenres,
          favoriteMovies: userProfile.pinnedFavoriteIds.map(id => allMovies.find(m => m.id === id)?.title).filter(Boolean),
          mood: customMood || selectedMood
        })
      });

      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to query AI recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const findMatchingExistingMovie = (title: string): Movie | undefined => {
    return allMovies.find(m => m.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(m.title.toLowerCase()));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* AI Discovery Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/50 to-indigo-950/50 border border-slate-800 p-6 sm:p-8">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini 3.7 AI Taste Engine
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tell AI what you're craving tonight
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Ask naturally for plot tropes, aesthetic vibes, director styles, or mix two movies together. We analyze your watchlist to find hidden gems.
          </p>

          {/* Prompt Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }} 
            className="mt-6 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Movies like Inception and Shutter Island with an unreliable narrator..."
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Matching Taste...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Recommend</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Mood Presets */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold">Popular Vibes:</span>
            {presetMoods.map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  setSelectedMood(preset.mood);
                  setPrompt(preset.query);
                  handleGenerate(preset.query, preset.mood);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Curated Recommendations
        </h3>
        <span className="text-xs text-slate-400">
          Trained on Collaborative Taste Profiles & Director Styles
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const matchedMovie = findMatchingExistingMovie(rec.title);
          const isSaved = matchedMovie ? watchlistMovieIds.includes(matchedMovie.id) : false;

          return (
            <div
              key={rec.title + index}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] uppercase font-bold border border-rose-500/30">
                        {rec.type}
                      </span>
                      <span className="text-xs text-slate-400">{rec.year}</span>
                      {rec.matchScore && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-xs font-black">
                          {rec.matchScore}% Match
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white tracking-tight mt-1.5">
                      {rec.title}
                    </h4>
                  </div>

                  {matchedMovie && (
                    <button
                      onClick={() => onToggleWatchlist(matchedMovie, 'want_to_watch')}
                      className={`p-2 rounded-xl border transition-colors ${
                        isSaved 
                          ? 'bg-rose-600/20 border-rose-500/40 text-rose-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* AI Pitch */}
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  "{rec.pitch}"
                </p>

                {/* Similar Connection */}
                {rec.similarTo && (
                  <div className="mt-3 text-xs text-amber-300/90 font-medium bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Recommended because you enjoy: <strong>{rec.similarTo}</strong></span>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {rec.genres?.map(g => (
                    <span key={g} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {g}
                    </span>
                  ))}
                  {rec.moodTags?.map(m => (
                    <span key={m} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-rose-300 border border-rose-500/20">
                      #{m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {matchedMovie ? (
                  <button
                    onClick={() => onSelectMovie(matchedMovie)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    View Details, Trailer & Cast
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    AI Curated Title
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
