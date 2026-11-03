'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Radio, ShieldCheck, ArrowRight, Clock, MapPin, EyeOff, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatRelativeTime } from '@/lib/utils/time';
import { ListSkeleton } from '@/components/ui/skeletons';

export default function LiveFeedPage() {
  const [filterAuction, setFilterAuction] = useState<string>('all');

  const {
    data: events,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['live-feed-events'],
    queryFn: () => apiClient.getLiveEvents(),
    refetchInterval: 6000, // Poll every 6 seconds for lively simulated activity
  });

  const { data: auctionsData } = useQuery({
    queryKey: ['auctions-filter-list'],
    queryFn: () => apiClient.getAuctions(),
  });

  const auctions = auctionsData?.auctions ?? [];

  const filteredEvents =
    filterAuction === 'all'
      ? events ?? []
      : (events ?? []).filter((e) => e.auctionId === filterAuction);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Activity
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of bid actions across Ethiopia.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Strict Privacy Assurance Box */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-start gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <EyeOff className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-emerald-300 block">Strict Bid Privacy Protocol</span>
          <span className="text-slate-400 mt-0.5 block leading-relaxed">
            In compliance with lowest-unique-bid fairness, bid values and bidder names are strictly
            confidential. Only non-revealing event notices are broadcast publicly.
          </span>
        </div>
      </div>

      {/* Filter by Auction Drops */}
      {auctions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterAuction('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterAuction === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Drops
          </button>
          {auctions.map((a) => (
            <button
              key={a.id}
              onClick={() => setFilterAuction(a.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterAuction === a.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {a.title.slice(0, 22)}...
            </button>
          ))}
        </div>
      )}

      {/* Feed List */}
      {isLoading ? (
        <ListSkeleton count={5} />
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <p className="text-sm font-bold text-slate-300">No activity recorded for this filter.</p>
          <p className="text-xs text-slate-500">Wait a few seconds for new bids to stream in.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-amber-500/40 transition-colors">
                  <Radio className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-amber-200 transition-colors truncate">
                    {event.displayMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatRelativeTime(event.timestamp)}
                    </span>
                    {event.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {event.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Navigation to this specific auction */}
              <Link
                href={`/auctions/${event.auctionId}`}
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-amber-400 p-2 rounded-xl group-hover:bg-amber-500/10 transition-all"
                title="Enter this auction"
              >
                <span className="hidden sm:inline">Bid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

