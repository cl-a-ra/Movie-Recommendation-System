import React, { useState } from 'react';
import { 
  X, Star, Bookmark, Share2, Bell, Play, ThumbsUp, 
  MessageSquare, Film, Sparkles, Check, Plus, AlertCircle, ExternalLink
} from 'lucide-react';
import { Movie, Review, WatchlistItem, WatchlistStatus, UserProfile } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectSimilar: (movie: Movie) => void;
  allMovies: Movie[];
  watchlistEntry?: WatchlistItem;
  onUpdateWatchlist: (movieId: string, status: WatchlistStatus, progress?: number, notes?: string, customLists?: string[]) => void;
  onRemoveFromWatchlist: (movieId: string) => void;
  reviews: Review[];
  onAddReview: (movieId: string, rating: number, text: string, tags: string[], hasSpoiler: boolean) => void;
  onLikeReview: (reviewId: string) => void;
  onShare: (movie: Movie) => void;
  onToggleNotificationAlert: (movie: Movie) => void;
  isNotificationSubscribed: boolean;
  userProfile: UserProfile;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onSelectSimilar,
  allMovies,
  watchlistEntry,
  onUpdateWatchlist,
  onRemoveFromWatchlist,
  reviews,
  onAddReview,
  onLikeReview,
  onShare,
  onToggleNotificationAlert,
  isNotificationSubscribed,
  userProfile
}) => {
  if (!movie) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'trailer'>('overview');
  const [showTrailer, setShowTrailer] = useState(false);

  // Review Form state
  const [userScore, setUserScore] = useState<number>(9);
  const [reviewContent, setReviewContent] = useState('');
  const [selectedReviewTags, setSelectedReviewTags] = useState<string[]>(['Masterpiece']);
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [showSpoilerReviews, setShowSpoilerReviews] = useState(false);

  // Watchlist edit state
  const [progressPercent, setProgressPercent] = useState<number>(watchlistEntry?.progressPercent || 0);
  const [personalNotes, setPersonalNotes] = useState<string>(watchlistEntry?.personalNotes || '');
  const [selectedCustomList, setSelectedCustomList] = useState<string>(watchlistEntry?.customLists?.[0] || '');

  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  const similarMovies = allMovies.filter(m => movie.similarIds?.includes(m.id) || m.genres.some(g => movie.genres.includes(g) && m.id !== movie.id)).slice(0, 4);

  const availableReviewTags = [
    'Masterpiece', 'Mind-Bending', 'Top Cinematography', 'Plot Twist', 
    'Emotional', 'Tearjerker', 'Soundtrack', 'Must Watch', 'Rewatchable'
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    onAddReview(movie.id, userScore, reviewContent.trim(), selectedReviewTags, hasSpoiler);
    setReviewContent('');
  };

  const handleWatchlistChange = (status: WatchlistStatus) => {
    onUpdateWatchlist(
      movie.id,
      status,
      progressPercent,
      personalNotes,
      selectedCustomList ? [selectedCustomList] : []
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Backdrop & Header Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-950/40" />

          {/* Close & Share Top Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => onShare(movie)}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors"
              title="Share Title"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Content (Poster + Key Meta) */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-end gap-4 z-10">
            <div className="w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800 flex-shrink-0 bg-slate-950">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase">
                  {movie.type}
                </span>
                <span className="text-xs text-slate-300 font-medium">{movie.year}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">{movie.duration}</span>
                {movie.matchScore && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-xs font-black">
                    {movie.matchScore}% Match
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-1 truncate">
                {movie.title}
              </h2>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-amber-500/30 text-amber-400 text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({movie.communityVotes.toLocaleString()} votes)
                  </span>
                </div>

                {movie.streamingOn && movie.streamingOn.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-slate-400">Stream on:</span>
                    {movie.streamingOn.map(s => (
                      <span key={s.name} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200">
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 px-4 sm:px-6 bg-slate-900/90">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-rose-500 text-rose-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Cast
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-rose-500 text-rose-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Community Reviews ({movieReviews.length})
          </button>
          {movie.trailerYoutubeId && (
            <button
              onClick={() => setActiveTab('trailer')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'trailer'
                  ? 'border-rose-500 text-rose-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Trailer
            </button>
          )}
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Watchlist & Push Notification Action Bar */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                    Your Watchlist Status
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['want_to_watch', 'watching', 'completed', 'favorites'] as WatchlistStatus[]).map((status) => {
                      const isSelected = watchlistEntry?.status === status;
                      const labels: Record<WatchlistStatus, string> = {
                        want_to_watch: 'Want to Watch',
                        watching: 'Watching',
                        completed: 'Completed',
                        favorites: 'Favorite ⭐'
                      };
                      return (
                        <button
                          key={status}
                          onClick={() => handleWatchlistChange(status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/40'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {labels[status]}
                        </button>
                      );
                    })}
                    {watchlistEntry && (
                      <button
                        onClick={() => onRemoveFromWatchlist(movie.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/50 border border-rose-900/50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Episode / Premiere Push Notification Alert Button */}
                {movie.upcomingEpisode && (
                  <div className="flex items-center gap-3 bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-rose-200">
                        S{movie.upcomingEpisode.season}E{movie.upcomingEpisode.episode}: {movie.upcomingEpisode.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Air Date: {movie.upcomingEpisode.airDate}
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleNotificationAlert(movie)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isNotificationSubscribed
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      {isNotificationSubscribed ? 'Alert Set' : 'Alert Me'}
                    </button>
                  </div>
                )}
              </div>

              {/* Story Synopsis */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Storyline
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Moods & Genres */}
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Genres
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {movie.genres.map(g => (
                      <span key={g} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {movie.moods && movie.moods.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Vibes & Moods
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {movie.moods.map(m => (
                        <span key={m} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cast & Director */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Cast & Crew
                </h3>
                <div className="text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-slate-300">Director / Creator:</span> {movie.director}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {movie.cast.map(c => (
                    <div key={c.name} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs font-bold text-slate-200 truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Movie Recommendations */}
              {similarMovies.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    If You Liked This, Watch These
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {similarMovies.map(sm => (
                      <div
                        key={sm.id}
                        onClick={() => onSelectSimilar(sm)}
                        className="group cursor-pointer bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden hover:border-rose-500/50 transition-all p-2"
                      >
                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-slate-900">
                          <img src={sm.posterUrl} alt={sm.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="text-xs font-bold text-slate-200 truncate group-hover:text-rose-400">
                          {sm.title}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                          <span>{sm.year}</span>
                          <span className="text-amber-400 font-semibold">⭐ {sm.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: REVIEWS & COMMUNITY RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Add Review Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Rate & Share Your Thoughts
                </h3>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Rating Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Your Score:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                        <button
                          type="button"
                          key={score}
                          onClick={() => setUserScore(score)}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                            userScore === score
                              ? 'bg-amber-500 text-slate-950 scale-110 shadow'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-amber-400 font-bold ml-1">
                      {userScore}/10
                    </span>
                  </div>

                  {/* Review Text Input */}
                  <textarea
                    rows={3}
                    placeholder={`What did you think of ${movie.title}? Mention favorite scenes, acting, or plot depth...`}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />

                  {/* Reaction Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400">Reaction Tag:</span>
                    {availableReviewTags.map(tag => {
                      const isSelected = selectedReviewTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            setSelectedReviewTags(
                              isSelected
                                ? selectedReviewTags.filter(t => t !== tag)
                                : [...selectedReviewTags, tag]
                            );
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-all ${
                            isSelected
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Spoiler Toggle & Submit Button */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={hasSpoiler}
                        onChange={(e) => setHasSpoiler(e.target.checked)}
                        className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Contains Plot Spoilers</span>
                    </label>

                    <button
                      type="submit"
                      disabled={!reviewContent.trim()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow transition-all"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              </div>

              {/* Community Reviews List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Community Reviews ({movieReviews.length})
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSpoilerReviews}
                      onChange={(e) => setShowSpoilerReviews(e.target.checked)}
                      className="rounded border-slate-700"
                    />
                    <span>Show Spoiler Reviews</span>
                  </label>
                </div>

                {movieReviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No reviews yet. Be the first to review {movie.title}!
                  </div>
                ) : (
                  movieReviews.map(r => {
                    if (r.hasSpoiler && !showSpoilerReviews) {
                      return (
                        <div key={r.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs flex items-center justify-between">
                          <span className="text-amber-400 font-medium">⚠️ Review hidden because it contains spoilers.</span>
                          <button
                            onClick={() => setShowSpoilerReviews(true)}
                            className="text-slate-300 underline font-semibold hover:text-white"
                          >
                            Reveal
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div key={r.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={r.userAvatar}
                              alt={r.userName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-200">{r.userName}</div>
                              <div className="text-[10px] text-slate-500">{r.createdAt}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{r.rating}/10</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {r.reviewText}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {r.tags?.map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={() => onLikeReview(r.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                              r.userLiked
                                ? 'text-rose-400 bg-rose-500/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{r.likes}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* TAB 3: TRAILER VIDEO */}
          {activeTab === 'trailer' && movie.trailerYoutubeId && (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0`}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="text-xs text-slate-400 text-center">
                Streaming Official HD Trailer for <strong>{movie.title}</strong>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
