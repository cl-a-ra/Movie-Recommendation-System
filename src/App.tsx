import React, { useState, useEffect, useMemo } from 'react';
import { 
  Film, Sparkles, Bookmark, Calendar, Bell, 
  Activity, Star, Play, ChevronRight, TrendingUp, Compass
} from 'lucide-react';
import { 
  Movie, WatchlistItem, Review, NotificationItem, 
  UserProfile, WatchlistStatus 
} from './types';
import { 
  INITIAL_MOVIES, INITIAL_REVIEWS, INITIAL_NOTIFICATIONS, 
  INITIAL_USER 
} from './data/mockMovies';

import { Navbar } from './components/Navbar';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { WatchlistManager } from './components/WatchlistManager';
import { AIRecommender } from './components/AIRecommender';
import { ShareModal } from './components/ShareModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationCenter } from './components/NotificationCenter';
import { UpcomingReleases } from './components/UpcomingReleases';
import { ScalabilityDashboard } from './components/ScalabilityDashboard';
import { FilterBar } from './components/FilterBar';

export default function App() {
  // Persistence state loaders
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('mrsmovies_watchlist') || localStorage.getItem('cinematch_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'w1', movieId: 'm1', status: 'completed', addedAt: '2026-08-20', progressPercent: 100, customLists: ['Weekend Mind-Benders'] },
      { id: 'w2', movieId: 'm3', status: 'watching', addedAt: '2026-08-22', progressPercent: 65, personalNotes: 'S02E07 mind blown!', customLists: [] },
      { id: 'w3', movieId: 'm8', status: 'favorites', addedAt: '2026-08-24', progressPercent: 100, customLists: ['Hans Zimmer Soundtracks'] }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('mrsmovies_reviews') || localStorage.getItem('cinematch_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('mrsmovies_notifications') || localStorage.getItem('cinematch_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mrsmovies_profile') || localStorage.getItem('cinematch_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER;
  });

  const [subscribedMovieIds, setSubscribedMovieIds] = useState<string[]>(['m3', 'm10']);

  // Active View & Navigation
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [shareMovie, setShareMovie] = useState<Movie | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScalabilityOpen, setIsScalabilityOpen] = useState(false);

  // Filter Bar state
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [selectedStreaming, setSelectedStreaming] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('match');

  // In-App Toast notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scalability Live Viewer Counter simulation
  const [activeUsersCount, setActiveUsersCount] = useState<number>(7420);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUsersCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mrsmovies_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('mrsmovies_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mrsmovies_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mrsmovies_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Watchlist Actions
  const handleToggleWatchlist = (movie: Movie, status: WatchlistStatus) => {
    const existing = watchlist.find(w => w.movieId === movie.id);
    if (existing) {
      if (existing.status === status) {
        // Toggle remove
        setWatchlist(watchlist.filter(w => w.movieId !== movie.id));
        showToast(`Removed "${movie.title}" from your Watchlist.`);
      } else {
        // Update status
        setWatchlist(watchlist.map(w => w.movieId === movie.id ? { ...w, status } : w));
        showToast(`Updated "${movie.title}" to ${status.replace('_', ' ')}.`);
      }
    } else {
      // Add new
      const newItem: WatchlistItem = {
        id: 'w-' + Date.now(),
        movieId: movie.id,
        status,
        addedAt: new Date().toISOString().split('T')[0],
        progressPercent: status === 'completed' ? 100 : 0,
        customLists: []
      };
      setWatchlist([...watchlist, newItem]);
      showToast(`Added "${movie.title}" to your Watchlist! ⭐`);
    }
  };

  const handleUpdateWatchlist = (
    movieId: string, 
    status: WatchlistStatus, 
    progress: number = 0, 
    notes?: string, 
    customLists: string[] = []
  ) => {
    const existing = watchlist.find(w => w.movieId === movieId);
    if (existing) {
      setWatchlist(watchlist.map(w => w.movieId === movieId ? {
        ...w,
        status,
        progressPercent: progress,
        personalNotes: notes,
        customLists
      } : w));
    } else {
      const newItem: WatchlistItem = {
        id: 'w-' + Date.now(),
        movieId,
        status,
        addedAt: new Date().toISOString().split('T')[0],
        progressPercent: progress,
        personalNotes: notes,
        customLists
      };
      setWatchlist([...watchlist, newItem]);
    }
    showToast(`Watchlist updated.`);
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    setWatchlist(watchlist.filter(w => w.movieId !== movieId));
    showToast(`Removed title from Watchlist.`);
  };

  const handleAddCustomList = (listName: string) => {
    if (!userProfile.customLists.includes(listName)) {
      setUserProfile({
        ...userProfile,
        customLists: [...userProfile.customLists, listName]
      });
      showToast(`Created custom list: "${listName}"`);
    }
  };

  // Review Actions
  const handleAddReview = (
    movieId: string, 
    rating: number, 
    text: string, 
    tags: string[], 
    hasSpoiler: boolean
  ) => {
    const newReview: Review = {
      id: 'r-' + Date.now(),
      movieId,
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      rating,
      reviewText: text,
      createdAt: 'Just now',
      likes: 1,
      userLiked: true,
      tags,
      hasSpoiler
    };

    setReviews([newReview, ...reviews]);
    setUserProfile({
      ...userProfile,
      totalReviewsWritten: userProfile.totalReviewsWritten + 1
    });
    showToast(`Your review & ${rating}/10 rating was published! 🎉`);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        const liked = !r.userLiked;
        return {
          ...r,
          userLiked: liked,
          likes: liked ? r.likes + 1 : Math.max(0, r.likes - 1)
        };
      }
      return r;
    }));
  };

  // Notification Alert Actions
  const handleToggleNotificationAlert = (movie: Movie) => {
    const isSubscribed = subscribedMovieIds.includes(movie.id);
    if (isSubscribed) {
      setSubscribedMovieIds(subscribedMovieIds.filter(id => id !== movie.id));
      showToast(`Push alerts disabled for "${movie.title}".`);
    } else {
      setSubscribedMovieIds([...subscribedMovieIds, movie.id]);
      showToast(`🔔 Push alert set! You'll be alerted when new episodes of "${movie.title}" drop.`);
      
      // Dispatch in-app notification item
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: `Alert Activated: ${movie.title}`,
        message: `You are subscribed to new episode and season release drops for ${movie.title}.`,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.posterUrl,
        type: 'episode_alert',
        timestamp: 'Just now',
        read: false
      };
      setNotifications([newNotif, ...notifications]);

      // Trigger browser notification if granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`🎬 CineMatch: Alert Subscribed`, {
          body: `We will push alerts to your device when ${movie.title} airs!`,
          icon: movie.posterUrl
        });
      }
    }
  };

  const handleTriggerTestPush = (customTitle?: string, customMessage?: string) => {
    const title = customTitle || '🎬 New Episode Dropped!';
    const message = customMessage || 'Severance S02E08 is now available on Apple TV+.';
    
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      movieId: 'm3',
      movieTitle: 'Severance',
      moviePoster: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&auto=format&fit=crop&q=80',
      type: 'episode_alert',
      timestamp: 'Just now',
      read: false
    };

    setNotifications([newNotif, ...notifications]);
    showToast(`🔔 Push Notification: ${title}`);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&auto=format&fit=crop&q=80'
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedMood('All');
    setSelectedStreaming('All');
    setSelectedType('all');
    setMinRating(0);
    setSortBy('match');
    setSearchQuery('');
  };

  // Filter and Search Pipeline
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesGenre = movie.genres.some(g => g.toLowerCase().includes(q));
        const matchesCast = movie.cast?.some(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesMood = movie.moods?.some(m => m.toLowerCase().includes(q));
        if (!matchesTitle && !matchesGenre && !matchesCast && !matchesDirector && !matchesMood) {
          return false;
        }
      }

      // Media Type
      if (selectedType !== 'all' && movie.type !== selectedType) {
        return false;
      }

      // Genre
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
        return false;
      }

      // Mood
      if (selectedMood !== 'All' && !movie.moods?.includes(selectedMood)) {
        return false;
      }

      // Streaming service
      if (selectedStreaming !== 'All' && !movie.streamingOn?.some(s => s.name === selectedStreaming)) {
        return false;
      }

      // Minimum rating
      if (minRating > 0 && movie.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.communityVotes - a.communityVotes;
      if (sortBy === 'year') return b.year - a.year;
      // Default: matchScore
      return (b.matchScore || 0) - (a.matchScore || 0);
    });
  }, [movies, searchQuery, selectedType, selectedGenre, selectedMood, selectedStreaming, minRating, sortBy]);

  // Featured Spotlight Movie
  const featuredMovie = movies.find(m => m.id === 'm1') || movies[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-rose-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        userProfile={userProfile}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenScalability={() => setIsScalabilityOpen(true)}
        activeUsersCount={activeUsersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* VIEW 1: DISCOVER / CATALOG */}
        {activeTab === 'discover' && (
          <div className="space-y-8">
            
            {/* Spotlight Banner (when no search active) */}
            {!searchQuery && selectedGenre === 'All' && selectedMood === 'All' && (
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                  <img
                    src={featuredMovie.backdropUrl || featuredMovie.posterUrl}
                    alt={featuredMovie.title}
                    className="w-full h-full object-cover object-center scale-105 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Spotlight Info */}
                  <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-10 max-w-2xl z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
                        Featured Match
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-black">
                        {featuredMovie.matchScore}% Taste Match
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{featuredMovie.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {featuredMovie.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {featuredMovie.overview}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => setSelectedMovie(featuredMovie)}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Explore & Trailer</span>
                      </button>

                      <button
                        onClick={() => handleToggleWatchlist(featuredMovie, 'want_to_watch')}
                        className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 backdrop-blur-md flex items-center gap-2 transition-all"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>Watchlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Filter and Discovery Bar */}
            <FilterBar
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              selectedStreaming={selectedStreaming}
              setSelectedStreaming={setSelectedStreaming}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              minRating={minRating}
              setMinRating={setMinRating}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
            />

            {/* Results Title & Count */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended for You'}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {filteredMovies.length} Titles
                </span>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                Sub-12ms Vector Match Engine
              </div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
                <Film className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">No movies found matching your filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing some filter tags or searching with broader keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {filteredMovies.map(movie => {
                  const watchlistEntry = watchlist.find(w => w.movieId === movie.id);
                  const isNotificationSubscribed = subscribedMovieIds.includes(movie.id);

                  return (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={(m) => setSelectedMovie(m)}
                      onToggleWatchlist={handleToggleWatchlist}
                      watchlistStatus={watchlistEntry?.status}
                      onToggleNotificationAlert={handleToggleNotificationAlert}
                      isNotificationSubscribed={isNotificationSubscribed}
                      onShare={(m) => setShareMovie(m)}
                    />
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: WATCHLISTS */}
        {activeTab === 'watchlists' && (
          <WatchlistManager
            watchlist={watchlist}
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onUpdateWatchlist={handleUpdateWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            userProfile={userProfile}
            onAddCustomList={handleAddCustomList}
          />
        )}

        {/* VIEW 3: AI MOOD & NATURAL LANGUAGE RECOMMENDER */}
        {activeTab === 'ai-curator' && (
          <AIRecommender
            userProfile={userProfile}
            allMovies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={handleToggleWatchlist}
            watchlistMovieIds={watchlist.map(w => w.movieId)}
          />
        )}

        {/* VIEW 4: UPCOMING RELEASES & EPISODE ALERTS */}
        {activeTab === 'upcoming' && (
          <UpcomingReleases
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleAlert={handleToggleNotificationAlert}
            subscribedMovieIds={subscribedMovieIds}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">MRSmovies</span>
            <span>— Scalable AI Movie Recommendation System</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsScalabilityOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              Scalability Telemetry ({activeUsersCount.toLocaleString()} Viewers)
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Movie Details & Reviews */}
      <MovieDetailsModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectSimilar={(m) => setSelectedMovie(m)}
        allMovies={movies}
        watchlistEntry={selectedMovie ? watchlist.find(w => w.movieId === selectedMovie.id) : undefined}
        onUpdateWatchlist={handleUpdateWatchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        reviews={reviews}
        onAddReview={handleAddReview}
        onLikeReview={handleLikeReview}
        onShare={(m) => setShareMovie(m)}
        onToggleNotificationAlert={handleToggleNotificationAlert}
        isNotificationSubscribed={selectedMovie ? subscribedMovieIds.includes(selectedMovie.id) : false}
        userProfile={userProfile}
      />

      {/* MODAL 2: Social Media Share Card Generator */}
      <ShareModal
        movie={shareMovie}
        onClose={() => setShareMovie(null)}
        userProfile={userProfile}
      />

      {/* MODAL 3: User Profile Customization */}
      {isProfileOpen && (
        <ProfileModal
          userProfile={userProfile}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
          allMovies={movies}
        />
      )}

      {/* MODAL 4: Push Notification Center */}
      {isNotificationsOpen && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onTriggerTestPush={handleTriggerTestPush}
          onSelectMovieById={(id) => {
            const m = movies.find(movie => movie.id === id);
            if (m) setSelectedMovie(m);
          }}
        />
      )}

      {/* MODAL 5: Scalability Telemetry Dashboard */}
      {isScalabilityOpen && (
        <ScalabilityDashboard onClose={() => setIsScalabilityOpen(false)} />
      )}

    </div>
  );
}
