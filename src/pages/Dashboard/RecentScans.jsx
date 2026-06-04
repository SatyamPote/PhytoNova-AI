import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Deterministic mock scans (newest first)
// ---------------------------------------------------------------------------
const MOCK_SCANS = [
  {
    id: 'mock-1',
    disease: 'Tomato___Early_blight',
    confidence: 0.94,
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'mock-2',
    disease: 'Healthy',
    confidence: 0.97,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'mock-3',
    disease: 'Tomato___Late_blight',
    confidence: 0.88,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'mock-4',
    disease: 'Tomato___Leaf_Mold',
    confidence: 0.91,
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: 'mock-5',
    disease: 'Healthy',
    confidence: 0.99,
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function diseaseLabel(raw) {
  if (!raw) return 'Unknown';
  if (raw === 'Healthy') return 'Healthy';
  // Strip prefix like "Tomato___"
  return raw.includes('___') ? raw.split('___').pop().replace(/_/g, ' ') : raw;
}

function diseaseColor(disease) {
  if (!disease || disease === 'Healthy') return 'text-primary';
  return 'text-amber-400';
}

// ---------------------------------------------------------------------------
// RecentScans — latest 5 detections for the user
// ---------------------------------------------------------------------------
export default function RecentScans({ isDemo }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);

  useEffect(() => {
    if (!user || !supabase) {
      setScans(MOCK_SCANS);
      return;
    }

    async function fetchScans() {
      const { data, error } = await supabase
        .from('detections')
        .select('id, disease, confidence, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error || !data || data.length === 0) {
        setScans(MOCK_SCANS);
        return;
      }
      setScans(data);
    }

    fetchScans();
  }, [user]);

  if (scans.length === 0) return null;

  return (
    <div className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-text-primary">Recent Scans</h3>
        {isDemo && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
            Demo data
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {scans.map((scan) => (
          <li key={scan.id}>
            <button
              onClick={() => navigate('/detect')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
            >
              {/* Image placeholder */}
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {scan.image_url ? (
                  <img
                    src={scan.image_url}
                    alt={scan.disease}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5 text-text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${diseaseColor(scan.disease)}`}>
                  {diseaseLabel(scan.disease)}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((scan.confidence ?? 0) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary flex-shrink-0">
                    {Math.round((scan.confidence ?? 0) * 100)}%
                  </span>
                </div>
              </div>

              {/* Date + arrow */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs text-text-secondary">
                  {formatDate(scan.created_at)}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}