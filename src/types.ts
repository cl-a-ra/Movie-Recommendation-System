export type MediaType = 'movie' | 'series';

export interface StreamingPlatform {
  name: string;
  logo: string;
  url?: string;
}

export interface CastMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface Movie {
  id: string;
  title: string;
  type: MediaType;
  year: number;
  releaseDate: string;
  duration: string; // e.g. "2h 28m" or "3 Seasons (24 eps)"
  rating: number; // 0 to 10
  communityVotes: number;
  genres: string[];
  moods: string[];
  director: string;
  cast: CastMember[];
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeId?: string;
  streamingOn: StreamingPlatform[];
  upcomingEpisode?: {
    season: number;
    episode: number;
    title: string;
    airDate: string; // YYYY-MM-DD
    alertEnabled?: boolean;
  };
  similarIds: string[];
  featured?: boolean;
  matchScore?: number; // Calculated dynamic recommendation score (0-100%)
  reasonForRecommendation?: string;
}

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'completed' | 'favorites';

export interface WatchlistItem {
  id: string;
  movieId: string;
  status: WatchlistStatus;
  addedAt: string;
  progressPercent: number; // 0 - 100
  currentEpisode?: string;
  userRating?: number; // 1 - 10
  personalNotes?: string;
  customLists: string[];
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 10
  reviewText: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  tags: string[];
  hasSpoiler: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  movieId?: string;
  movieTitle?: string;
  moviePoster?: string;
  type: 'episode_alert' | 'release' | 'recommendation' | 'community';
  timestamp: string;
  read: boolean;
  scheduledAirDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  favoriteGenres: string[];
  pinnedFavoriteIds: string[];
  totalWatchHours: number;
  totalMoviesWatched: number;
  totalSeriesWatched: number;
  totalReviewsWritten: number;
  notificationsEnabled: boolean;
  customLists: string[];
}

export interface ScalabilityMetrics {
  activeConcurrentUsers: number;
  cacheHitRatio: number; // e.g., 99.4%
  averageResponseTimeMs: number; // e.g., 14ms
  databaseQueriesPerSec: number;
  readReplicaNodes: number;
  edgeCdnLocations: number;
  memoryUsageMb: number;
}
