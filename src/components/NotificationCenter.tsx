import React, { useState } from 'react';
import { 
  X, Bell, CheckCircle2, Clock, Sparkles, Tv, 
  Film, MessageSquare, AlertCircle, Play, Check
} from 'lucide-react';
import { NotificationItem, Movie } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerTestPush: (customTitle?: string, customMessage?: string) => void;
  onSelectMovieById: (movieId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onTriggerTestPush,
  onSelectMovieById
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestBrowserPush = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        new Notification('🎬 CineMatch Alerts Activated!', {
          body: 'You will receive push notifications when new episodes and releases drop.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'episode_alert':
        return <Tv className="w-4 h-4 text-rose-400" />;
      case 'release':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notification Center</h3>
              <p className="text-xs text-slate-400">Push alerts for upcoming episodes & releases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner & Test Trigger */}
        <div className="p-3.5 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${browserPermission === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              Browser Web Push: <strong>{browserPermission === 'granted' ? 'Enabled' : 'Not Granted'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {browserPermission !== 'granted' && (
              <button
                onClick={requestBrowserPush}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold border border-slate-700"
              >
                Enable Push
              </button>
            )}

            <button
              onClick={() => onTriggerTestPush('🔔 Severance Episode Alert!', 'S02E08 is now streaming on Apple TV+.')}
              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold border border-rose-500/30 transition-colors"
              title="Simulate a real push episode drop notification"
            >
              ⚡ Test Push Alert
            </button>
          </div>
        </div>

        {/* Filter Pills & Mark All Read */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'episode_alert', label: 'Episodes' },
              { id: 'release', label: 'Releases' },
              { id: 'recommendation', label: 'AI Recs' },
              { id: 'community', label: 'Social' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                  filterType === tab.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 whitespace-nowrap ml-2"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.read) onMarkAsRead(item.id);
                  if (item.movieId) {
                    onSelectMovieById(item.movieId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                  item.read
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:border-slate-700'
                    : 'bg-slate-950/90 border-rose-500/30 hover:border-rose-500/50 shadow-md'
                }`}
              >
                {/* Poster or Icon */}
                {item.moviePoster ? (
                  <div className="w-12 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-800">
                    <img src={item.moviePoster} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 truncate">
                      {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />}
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {item.scheduledAirDate && (
                    <div className="mt-1.5 text-[10px] font-semibold text-rose-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Scheduled Premiere: {item.scheduledAirDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
