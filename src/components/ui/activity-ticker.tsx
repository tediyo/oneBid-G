'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Radio, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatRelativeTime } from '@/lib/utils/time';

export function ActivityTicker() {
  const { data: events } = useQuery({
    queryKey: ['live-events'],
    queryFn: () => apiClient.getLiveEvents(),
    refetchInterval: 12000, // auto poll fresh events every 12s
  });

  const latestEvent = events?.[0];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Safe Live Feed
            </span>
            {latestEvent?.city && (
              <span className="text-[10px] text-slate-500 font-medium">
                • {latestEvent.city}
              </span>
            )}
            {latestEvent && (
              <span className="text-[10px] text-slate-500 font-mono">
                • {formatRelativeTime(latestEvent.timestamp)}
              </span>
            )}
          </div>
          {/* Strict Privacy: NEVER displays exact bid amounts or identities */}
          <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
            {latestEvent ? latestEvent.displayMessage : 'Live bid activity monitor active...'}
          </p>
        </div>
      </div>

      <Link
        href="/live"
        className="shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-all border border-amber-500/20"
      >
        <span>Live</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

