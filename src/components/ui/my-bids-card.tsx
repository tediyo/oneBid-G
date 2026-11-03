'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';

export function MyBidsHomeCard() {
  const { data: myBids } = useQuery({
    queryKey: ['my-bids'],
    queryFn: () => apiClient.getMyBids(),
  });

  const bidsCount = myBids?.length ?? 0;
  const uniqueLowestBids = myBids?.filter((b) => b.status === 'unique_lowest') ?? [];
  const hasLowest = uniqueLowestBids.length > 0;

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#11192d] to-slate-900 border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">My Active Bids</h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                {bidsCount} Placed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              {hasLowest ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  You hold the Lowest Unique Bid on {uniqueLowestBids[0].auctionTitle.slice(0, 20)}...
                </span>
              ) : (
                <span>Check your secret bid amounts and statuses.</span>
              )}
            </p>
          </div>
        </div>

        <Link
          href="/my-bids"
          className="shrink-0 flex items-center gap-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Private & Encrypted to your account only</span>
        </div>
        <Link href="/my-bids" className="text-amber-400 hover:underline font-medium">
          View all {bidsCount} &rarr;
        </Link>
      </div>
    </div>
  );
}

