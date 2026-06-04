import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Build last 7 days array (newest first)
// ---------------------------------------------------------------------------
function buildLast7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ date: d, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), iso: d.toISOString().slice(0, 10) });
  }
  return days;
}

// ---------------------------------------------------------------------------
// Mock grouped detections (last 7 days)
// ---------------------------------------------------------------------------
const MOCK_TIMELINE = [
  { date: buildLast7Days()[0].iso, count: 5, topDisease: 'Early Blight' },
  { date: buildLast7Days()[1].iso, count: 3, topDisease: 'Late Blight' },
  { date: buildLast7Days()[2].iso, count: 0, topDisease: null },
  { date: buildLast7Days()[3].iso, count: 7, topDisease: 'Healthy' },
  { date: buildLast7Days()[4].iso, count: 2, topDisease: 'Leaf Mold' },
  { date: buildLast7Days()[5].iso, count: 4, topDisease: 'Bacterial Spot' },
  { date: buildLast7Days()[6].iso, count: 1, topDisease: 'Healthy' },
];

// ---------------------------------------------------------------------------
// ActivityTimeline — vertical timeline grouped by date
// ---------------------------------------------------------------------------
export default function ActivityTimeline({ isDemo }) {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    if (!user || !supabase) {
      setTimeline(MOCK_TIMELINE);
      return;
    }

    async function fetchTimeline() {
      // Fetch detections from last 7 days
      const since = new Date();
      since.setDate(since.getDate() - 7);
      since.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('detections')
        .select('disease, created_at')
        .eq('user_id', user.id)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setTimeline(MOCK_TIMELINE);
        return;
      }

      // Group by date
      const groups = {};
      data.forEach((d) => {
        const iso = d.created_at.slice(0, 10);
        if (!groups[iso]) groups[iso] = [];
        groups[iso].push(d.disease);
      });

      // Build 7-day slots
      const days = buildLast7Days();
      const result = days.map(({ iso, label }) => {
        const diseases = groups[iso] ?? [];
        const count = diseases.length;
        const freq = {};
        diseases.forEach((dis) => { freq[dis] = (freq[dis] || 0) + 1; });
        const topDisease =
          Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        return { date: iso, label, count, topDisease };
      });

      setTimeline(result);
    }

    fetchTimeline();
  }, [user]);

  if (timeline.length === 0) return null;

  const maxCount = Math.max(...timeline.map((t) => t.count), 1);

  return (
    <div className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">Activity — Last 7 Days</h3>
        {isDemo && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
            Demo data
          </span>
        )}
      </div>

      {/* Vertical timeline */}
      <ol className="relative border-l border-white/15 ml-3 flex flex-col gap-5">
        {timeline.map((item) => (
          <li key={item.date} className="ml-5 flex items-start gap-4">
            {/* Dot */}
            <span
              className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 mt-1.5 ${
                item.count > 0
                  ? 'border-primary bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                  : 'border-white/30 bg-transparent'
              }`}
            />

            {/* Date label */}
            <div className="flex-shrink-0 w-24 text-xs text-text-secondary font-medium pt-1">
              {item.label}
            </div>

            {/* Bar + count + disease */}
            <div className="flex-1 min-w-0">
              {item.count > 0 ? (
                <div className="flex flex-col gap-1">
                  {/* Bar */}
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${Math.round((item.count / maxCount) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      {item.count} scan{item.count !== 1 ? 's' : ''}
                    </span>
                    {item.topDisease && (
                      <span
                        className={`text-xs font-medium ${
                          item.topDisease === 'Healthy' ? 'text-primary' : 'text-amber-400'
                        }`}
                      >
                        {item.topDisease === 'Healthy'
                          ? 'Healthy'
                          : item.topDisease.includes('___')
                          ? item.topDisease.split('___').pop().replace(/_/g, ' ')
                          : item.topDisease}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-1.5 rounded-full bg-white/5" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}