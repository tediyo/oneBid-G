'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Trophy, RefreshCcw, ArrowRight, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';
import { formatRelativeTime } from '@/lib/utils/time';
import { ListSkeleton } from '@/components/ui/skeletons';

export default function ResultsPage() {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['auction-results'],
    queryFn: () => apiClient.getResults(),
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Auction Winners & Results
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Official verified outcomes for concluded lowest-unique-bid auctions.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={4} />
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-rose-400 text-xs">Failed to load auction results.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {results?.map((res) => {
            const isWinner = res.hasWinner && res.winningAmountUnits !== null;
            return (
              <Link
                key={res.auctionId}
                href={`/results/${res.auctionId}`}
                className="block group"
              >
                <div className="p-4 rounded-2xl glass-card transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-24 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <Image
                        src={res.imageUrl}
                        alt={res.auctionTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isWinner ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            <Trophy className="w-3 h-3 text-amber-400" /> Winner Crowned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                            <RefreshCcw className="w-3 h-3 text-rose-400" /> Rerun Scheduled
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {formatRelativeTime(res.publishedAt)}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors mt-1 truncate">
                        {res.auctionTitle}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        {isWinner ? (
                          <>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <span>Winning Bid:</span>
                              <span className="font-mono font-black text-emerald-400 text-sm">
                                {formatETB(res.winningAmountUnits!)}
                              </span>
                              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                                Saved {((1 - res.winningAmountUnits! / res.retailPriceUnits) * 100).toFixed(2)}%
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-300">
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                              <span>{res.winnerDisplayName}</span>
                              {res.winnerCity && (
                                <span className="text-slate-500">({res.winnerCity})</span>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-300 text-xs">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>No Unique Bid — Scheduled for Re-run</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Arrow */}
                    <div className="hidden sm:flex items-center text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

