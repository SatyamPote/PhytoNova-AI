import { useEffect, useState } from 'react';
import StatsCards from './StatsCards';
import DiseaseChart from './DiseaseChart';
import RecentScans from './RecentScans';
import ActivityTimeline from './ActivityTimeline';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  // Determine if we are in demo mode (no Supabase or no user)
  useEffect(() => {
    if (!supabase || !user) {
      setIsDemo(true);
    } else {
      setIsDemo(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Dashboard
            </h1>
            <p className="mt-2 text-text-secondary">
              Your detection analytics and scan history in one place.
            </p>
          </div>
          {isDemo && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 text-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span>Demo data — connect Supabase to see your real stats</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <StatsCards isDemo={isDemo} />
      </div>

      {/* ── Charts + recent scans ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disease distribution chart — spans 1 col on lg */}
          <div className="lg:col-span-1">
            <DiseaseChart isDemo={isDemo} />
          </div>

          {/* Recent scans list — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <RecentScans isDemo={isDemo} />
          </div>
        </div>
      </div>

      {/* ── Activity timeline (full width) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ActivityTimeline isDemo={isDemo} />
      </div>
    </div>
  );
}