import React, { useState } from 'react';
import { 
  Film, Search, Bell, User, Sparkles, 
  Calendar, Bookmark, Activity, X, CheckCircle
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  userProfile: UserProfile;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenScalability: () => void;
  activeUsersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  notifications,
  userProfile,
  onOpenNotifications,
  onOpenProfile,
  onOpenScalability,
  activeUsersCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-rose-400 bg-clip-text text-transparent">
                  MRSmovies
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  AI Recommender
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'discover'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('watchlists')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'watchlists'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Watchlists
              </button>
              <button
                onClick={() => setActiveTab('ai-curator')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ai-curator'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Mood Match
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'upcoming'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Episode Alerts
              </button>
            </nav>
          </div>

          {/* Search Bar & Live Actions */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search movies, genres, cast, directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* Live Concurrency & Scale telemetry trigger */}
            <button
              onClick={onOpenScalability}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/15 transition-all"
              title="Scalable Database & Architecture Metrics"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Activity className="w-3.5 h-3.5" />
              <span>{activeUsersCount.toLocaleString()} Viewers</span>
            </button>

            {/* Push Notifications Trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
              title="User Profile & Settings"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-lg object-cover border border-rose-500/30"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-200">
                {userProfile.name}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movies, series, cast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Pills */}
        <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto scrollbar-none text-xs border-t border-slate-900">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              activeTab === 'discover' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('watchlists')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              activeTab === 'watchlists' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Watchlists
          </button>
          <button
            onClick={() => setActiveTab('ai-curator')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              activeTab === 'ai-curator' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-900 text-slate-400'
            }`}
          >
            AI Mood
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              activeTab === 'upcoming' ? 'bg-rose-600 text-white font-medium' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Alerts
          </button>
        </div>

      </div>
    </header>
  );
};
