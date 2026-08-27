import React, { useState } from 'react';
import { 
  X, Share2, Copy, Check, Star, Sparkles, MessageCircle, 
  Send, ExternalLink, Globe, Smartphone
} from 'lucide-react';
import { Movie, UserProfile } from '../types';

interface ShareModalProps {
  movie: Movie | null;
  onClose: () => void;
  userProfile: UserProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  movie,
  onClose,
  userProfile
}) => {
  if (!movie) return null;

  const [copied, setCopied] = useState(false);
  const [customQuote, setCustomQuote] = useState(`You have to watch "${movie.title}"! Rated ${movie.rating}/10 on MRSmovies.`);
  const [cardTheme, setCardTheme] = useState<'noir' | 'rose' | 'amber'>('noir');

  const shareUrl = window.location.href;
  const shareText = `🎬 Check out "${movie.title}" (${movie.year}) - ⭐ ${movie.rating}/10 on MRSmovies Recommendation System!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MRSmovies: ${movie.title}`,
          text: customQuote,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(customQuote)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(customQuote + ' ' + shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(customQuote)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Recommendation: ${movie.title}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Recommendation</h3>
              <p className="text-xs text-slate-400">Recommend to friends on social media or direct message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Visual Story Card Preview */}
        <div className="my-5">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Visual Story Card Preview</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCardTheme('noir')}
                className={`w-4 h-4 rounded-full bg-slate-950 border ${cardTheme === 'noir' ? 'ring-2 ring-rose-500' : 'border-slate-700'}`}
                title="Noir Theme"
              />
              <button
                onClick={() => setCardTheme('rose')}
                className={`w-4 h-4 rounded-full bg-rose-950 border ${cardTheme === 'rose' ? 'ring-2 ring-rose-500' : 'border-slate-700'}`}
                title="Crimson Theme"
              />
              <button
                onClick={() => setCardTheme('amber')}
                className={`w-4 h-4 rounded-full bg-amber-950 border ${cardTheme === 'amber' ? 'ring-2 ring-rose-500' : 'border-slate-700'}`}
                title="Golden Amber Theme"
              />
            </div>
          </div>

          <div 
            className={`p-4 rounded-2xl border transition-all flex gap-4 ${
              cardTheme === 'noir'
                ? 'bg-slate-950 border-slate-800 text-slate-100'
                : cardTheme === 'rose'
                ? 'bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 border-rose-900/50 text-rose-100'
                : 'bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 border-amber-900/50 text-amber-100'
            }`}
          >
            <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-slate-800 flex-shrink-0 bg-slate-900">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                    MRSmovies Rec
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{movie.rating.toFixed(1)}/10</span>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-black truncate mt-0.5">
                  {movie.title} ({movie.year})
                </h4>

                <p className="text-xs opacity-80 mt-1 italic line-clamp-2">
                  "{customQuote}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] opacity-70 pt-2 border-t border-white/10">
                <span>Shared by @{userProfile.username}</span>
                <span>mrsmovies.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Quote Message Editor */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-semibold text-slate-300">
            Personal Note / Caption:
          </label>
          <input
            type="text"
            value={customQuote}
            onChange={(e) => setCustomQuote(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Social Media Share Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Share Directly To:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="font-bold">𝕏</span> Twitter / X
            </a>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/40 text-xs font-semibold text-sky-300 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Telegram
            </a>
            <a
              href={shareLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-800/40 text-xs font-semibold text-orange-300 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> Reddit
            </a>
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 text-xs font-semibold text-indigo-300 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile Share
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 text-xs font-semibold text-rose-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
