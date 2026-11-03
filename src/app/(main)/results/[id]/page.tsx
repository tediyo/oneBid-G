'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  RefreshCcw,
  CheckCircle2,
  ChevronLeft,
  Users,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';
import { formatRelativeTime } from '@/lib/utils/time';
import { AuctionDetailsSkeleton } from '@/components/ui/skeletons';

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['auction-result', auctionId],
    queryFn: () => apiClient.getResultById(auctionId),
  });

  if (isLoading) {
    return (
      <div className="py-4">
        <AuctionDetailsSkeleton />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <p className="text-rose-400 font-bold">Result not found</p>
        <button
          onClick={() => router.push('/results')}
          className="text-xs text-amber-400 hover:underline"
        >
          &larr; Back to Results
        </button>
      </div>
    );
  }

  const isWinner = result.hasWinner && result.winningAmountUnits !== null;

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/results')}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Results
        </button>
        <span className="text-[10px] text-slate-500 font-mono">Concluded Drop</span>
      </div>

      {/* Prize Image & Status Banner */}
      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <Image
          src={result.imageUrl}
          alt={result.auctionTitle}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4">
          {isWinner ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20">
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>Official Verified Winner</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-lg shadow-rose-500/20">
              <RefreshCcw className="w-4 h-4" />
              <span>No Unique Bid — Rerun Scheduled</span>
            </div>
          )}
          <h1 className="text-lg sm:text-xl font-black text-white mt-2 leading-tight">
            {result.auctionTitle}
          </h1>
        </div>
      </div>

      {/* Winning Outcome Card or Rerun Card */}
      {isWinner ? (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <span className="text-xs uppercase font-bold text-amber-300">
              Winning Lowest Unique Bid
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Published {formatRelativeTime(result.publishedAt)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                {formatETB(result.winningAmountUnits!)}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Retail Value: {formatETB(result.retailPriceUnits)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <span>
                  Winner Saved {((1 - result.winningAmountUnits! / result.retailPriceUnits) * 100).toFixed(2)}% on this item!
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 block">Verified Winner</span>
              <span className="text-sm font-extrabold text-white">
                {result.winnerDisplayName}
              </span>
              {result.winnerCity && (
                <span className="text-xs text-amber-400 block">{result.winnerCity}</span>
              )}
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                Settled & Dispatched ✓
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/15 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <h3 className="font-bold text-sm">Every Bid Had a Duplicate</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {result.rerunNote ||
              'No bidder submitted an unmatched decimal value. Under Mini-Bid Lowest Unique Bid rules, when all submitted bids are duplicated, the prize is scheduled for an official re-run drop.'}
          </p>
          {result.rerunDate && (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> Next Re-run Date:
              </span>
              <span className="font-bold text-white">
                {new Date(result.rerunDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Participation Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-4 h-4 text-amber-400" /> Total Bidders
          </div>
          <div className="mt-1 text-xl font-black text-white">
            {result.totalParticipants.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Trophy className="w-4 h-4 text-emerald-400" /> Total Bids Recorded
          </div>
          <div className="mt-1 text-xl font-black text-white">
            {result.totalBidsPlaced.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Fairness & Algorithm Verification Note */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verifiable Fairness Audit
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          All bids submitted in this auction were processed via our integer subunit ledger with
          cryptographic timestamping. Winner determination strictly followed the lowest unique
          frequency formula.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/auctions"
          className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
        >
          <span>Browse Active Auctions</span>
        </Link>
      </div>
    </div>
  );
}

