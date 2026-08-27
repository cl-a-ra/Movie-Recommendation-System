import React, { useState } from 'react';
import { 
  X, User, Camera, Sparkles, Check, Film, 
  Tv, Clock, MessageSquare, Bell, Heart, Plus, Trash2
} from 'lucide-react';
import { UserProfile, Movie } from '../types';

interface ProfileModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  allMovies: Movie[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  onClose,
  onUpdateProfile,
  allMovies
}) => {
  const [name, setName] = useState(userProfile.name);
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(userProfile.favoriteGenres);
  const [pinnedIds, setPinnedIds] = useState<string[]>(userProfile.pinnedFavoriteIds);
  const [notificationsEnabled, setNotificationsEnabled] = useState(userProfile.notificationsEnabled);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80'
  ];

  const availableGenres = [
    'Sci-Fi', 'Action', 'Thriller', 'Drama', 'Crime', 
    'Adventure', 'Animation', 'Comedy', 'Mystery', 'Fantasy', 'Horror', 'Biography'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      username,
      bio,
      avatar,
      favoriteGenres: selectedGenres,
      pinnedFavoriteIds: pinnedIds,
      notificationsEnabled
    });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 800);
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removePinned = (id: string) => {
    setPinnedIds(pinnedIds.filter(pid => pid !== id));
  };

  const addPinned = (id: string) => {
    if (pinnedIds.length < 4 && !pinnedIds.includes(id)) {
      setPinnedIds([...pinnedIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Customize Profile</h3>
              <p className="text-xs text-slate-400">Personalize your cinema identity, favorite genres & pinboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/40 shadow-lg bg-slate-950"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-xs font-semibold text-slate-400">Choose Profile Avatar:</div>
              <div className="flex items-center gap-2 flex-wrap">
                {presetAvatars.map((pAvatar, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatar(pAvatar)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                      avatar === pAvatar ? 'border-rose-500 scale-110' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={pAvatar} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Username (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what kind of films and directors you love..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Top 4 Pinned Favorites (Letterboxd Style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Top 4 All-Time Favorites ({pinnedIds.length}/4)
              </label>
              <span className="text-[11px] text-slate-400">Showcased on your profile</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map((slotIdx) => {
                const movieId = pinnedIds[slotIdx];
                const movie = allMovies.find(m => m.id === movieId);

                if (movie) {
                  return (
                    <div key={slotIdx} className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow">
                      <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePinned(movie.id)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from Top 4"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div 
                    key={slotIdx}
                    className="aspect-[2/3] rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-slate-600 text-[10px] p-2 text-center"
                  >
                    <span>+ Slot {slotIdx + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick add selector for pinned */}
            {pinnedIds.length < 4 && (
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addPinned(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="">+ Add Movie to Top 4 Favorites...</option>
                  {allMovies.filter(m => !pinnedIds.includes(m.id)).map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Favorite Genres */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Favorite Genres (Trained into Recommendation Engine)
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableGenres.map(genre => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Push Notifications for Air Dates</div>
                <div className="text-[11px] text-slate-400">Receive alerts when new episodes or seasons drop for watchlist shows</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Viewing Stats Widget */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <Clock className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <div className="text-base font-black text-white">{userProfile.totalWatchHours} hrs</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Watch Time</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <Film className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-base font-black text-white">{userProfile.totalMoviesWatched}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Films Watched</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <Tv className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-base font-black text-white">{userProfile.totalSeriesWatched}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Series Watched</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <MessageSquare className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <div className="text-base font-black text-white">{userProfile.totalReviewsWritten}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Reviews</div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
            >
              {isSavedToast ? <Check className="w-4 h-4 text-emerald-300" /> : null}
              <span>{isSavedToast ? 'Saved!' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
