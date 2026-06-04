import { useEffect, useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HistoryItem({ item }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.disease}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/10"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-text-primary font-medium text-sm truncate">
          {item.disease?.replace(/_/g, ' ')}
        </p>
        <p className="text-text-secondary text-xs mt-0.5">
          {formatDate(item.created_at)}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <span
          className={`
            inline-block text-xs font-semibold px-2 py-0.5 rounded-full
            ${item.confidence >= 0.8
              ? 'bg-emerald-500/20 text-emerald-300'
              : item.confidence >= 0.6
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-red-500/20 text-red-300'
            }
          `}
        >
          {Math.round(item.confidence * 100)}%
        </span>
      </div>
    </div>
  );
}

export default function HistoryPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchHistory() {
      setLoading(true);
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('detections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }

    fetchHistory();
  }, [user]);

  // Expose a refresh function via a custom event
  useEffect(() => {
    const handler = () => {
      if (!user || !supabase) return;
      supabase
        .from('detections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setItems(data);
        });
    };
    window.addEventListener('phytanova:history:refresh', handler);
    return () => window.removeEventListener('phytanova:history:refresh', handler);
  }, [user]);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary font-semibold text-lg">
          Detection History
        </h3>
        {items.length > 0 && (
          <span className="text-xs text-text-secondary bg-white/8 px-2 py-0.5 rounded-full">
            {items.length} scan{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-6 h-6 text-text-secondary/50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
          </div>
          <p className="text-text-secondary text-sm">
            {user
              ? 'No scans yet — try uploading a plant image above.'
              : 'Sign in to view your scan history.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1 divide-y divide-white/5">
          {items.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </GlassCard>
  );
}