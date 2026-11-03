'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  Lock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';
import { formatRelativeTime } from '@/lib/utils/time';
import { PersonalBidStatusBadge } from '@/components/ui/status-badge';
import { ListSkeleton } from '@/components/ui/skeletons';

const FILTER_TABS = [
  { id: 'all', label: 'All Bids' },
  { id: 'unique_lowest', label: '★ Lowest Unique' },
  { id: 'unique_not_lowest', label: 'Unique' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'won', label: '🏆 Won' },
];

export default function MyBidsPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: bids, isLoading, error } = useQuery({
    queryKey: ['my-bids'],
    queryFn: () => apiClient.getMyBids(),
  });

  const allBids = bids ?? [];
  const filteredBids =
    statusFilter === 'all'
      ? allBids
      : allBids.filter((b) => b.status === statusFilter);

  const lowestUniqueCount = allBids.filter((b) => b.status === 'unique_lowest').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Secret Bids Ledger
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Confidential record of all your submitted numeric bids and real-time status.
        </p>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-300 block">Personal Encrypted Ledger</span>
          <span className="text-amber-200/80 mt-0.5 block leading-relaxed">
            These bid amounts are exclusively visible to your authenticated account. No other
            competitor can view your values.
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Bids Placed</span>
          <div className="text-2xl font-black text-white mt-1">{allBids.length}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">1 attempt each</span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Lowest Unique
          </span>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            {lowestUniqueCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Currently in winning rank</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bids List */}
      {isLoading ? (
        <ListSkeleton count={4} />
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-rose-400">Failed to load personal bids.</p>
        </div>
      ) : filteredBids.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <p className="text-sm font-bold text-slate-300">No bids found in this category.</p>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            <span>Explore Active Auctions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBids.map((bid) => (
            <div
              key={bid.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/auctions/${bid.auctionId}`}
                  className="font-bold text-sm text-white hover:text-amber-300 transition-colors line-clamp-1"
                >
                  {bid.auctionTitle}
                </Link>
                <PersonalBidStatusBadge status={bid.status} />
              </div>

              <div className="flex items-end justify-between pt-1 border-t border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Your Secret Amount
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-black text-lg text-amber-400">
                      {formatETB(bid.amountUnits)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({bid.amountUnits} subunits)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {formatRelativeTime(bid.placedAt)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">1 attempt used</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

