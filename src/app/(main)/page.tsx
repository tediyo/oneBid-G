'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  HelpCircle,
  Gavel,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';
import { CountdownBadge } from '@/components/ui/countdown-badge';
import { AuctionCard } from '@/components/ui/auction-card';
import { ActivityTicker } from '@/components/ui/activity-ticker';
import { MyBidsHomeCard } from '@/components/ui/my-bids-card';
import { AuctionCardSkeleton } from '@/components/ui/skeletons';

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Drops', value: 'all' },
  { label: '💰 Cash Drops', value: 'cash' },
  { label: '🚗 Cars & Motors', value: 'cars' },
  { label: '📱 Tech & Gadgets', value: 'tech' },
  { label: '🏠 Appliances', value: 'appliances' },
  { label: '🎟️ Vouchers', value: 'vouchers' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['auctions', selectedCategory],
    queryFn: () =>
      apiClient.getAuctions({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
      }),
  });

  const auctions = data?.auctions ?? [];
  const featuredAuction = auctions.find((a) => a.featured && a.status === 'live') ?? auctions[0];

  return (
    <div className="space-y-6">
      {/* Safe Live Activity Ticker (Privacy Protected) */}
      <ActivityTicker />

      {/* Featured Auction Banner (OneBid Reference) */}
      {featuredAuction && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/25 to-slate-900 border border-amber-500/30 p-5 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Featured Drop
            </span>
            <CountdownBadge
              closesAt={featuredAuction.closesAt}
              serverTime={featuredAuction.serverTime}
              size="md"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                  {featuredAuction.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Winner Pays Winning Bid Only
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {featuredAuction.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {featuredAuction.shortDescription}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Retail Value</span>
                  <span className="text-sm font-extrabold text-amber-300">
                    {formatETB(featuredAuction.retailPriceUnits)}
                  </span>
                </div>
                <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-medium">Entry Bid Fee</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {formatETB(featuredAuction.bidFeeUnits)}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <Link
                  href={`/auctions/${featuredAuction.id}`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Gavel className="w-4 h-4 fill-slate-950" />
                  <span>Enter Auction</span>
                </Link>

                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors border border-slate-700/60"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>How it works</span>
                </button>
              </div>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-xl hidden md:block">
              <Image
                src={featuredAuction.imageUrl}
                alt={featuredAuction.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Prominent Shortcut: My Bids Status Card */}
      <section>
        <MyBidsHomeCard />
      </section>

      {/* Category Filter Pills (Cash, Cars, Tech, Appliances, Vouchers) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Browse Prize Drops
          </h2>
          <Link
            href="/auctions"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Auctions Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AuctionCardSkeleton />
            <AuctionCardSkeleton />
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-sm text-rose-400">Failed to load auctions. Please try again.</p>
          </div>
        ) : auctions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="text-sm font-bold text-slate-300">No auctions found in this category.</p>
            <p className="text-xs text-slate-500">Check back soon for new drops!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>

      {/* OneBid Trust & Regulation Banner */}
      <section className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>18+ Only</strong> • Mathematical Lowest Unique Bid Model • Not a Lottery
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-[11px] text-slate-500">
          <span>Telebirr & CBE Payouts</span>
          <span>•</span>
          <span>Addis Ababa, Ethiopia</span>
        </div>
      </section>

      {/* OneBid Lowest Unique Bid Explainer Modal with Visual Game Theory Table */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">How OneBid Works</h3>
                  <p className="text-[11px] text-slate-400">Lowest Unique Bid Wins Cash, Cars & Tech</p>
                </div>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Visual Example Box (OneBid Reference) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold text-amber-300 block">
                Visual Example (How the Winner is Decided):
              </span>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between border border-slate-800">
                  <span className="text-slate-400">Bidder 1: 0.10 ETB</span>
                  <span className="text-rose-400 text-[11px] flex items-center gap-1 font-sans">
                    <XCircle className="w-3.5 h-3.5" /> Duplicate (Disqualified)
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between border border-slate-800">
                  <span className="text-slate-400">Bidder 2: 0.10 ETB</span>
                  <span className="text-rose-400 text-[11px] flex items-center gap-1 font-sans">
                    <XCircle className="w-3.5 h-3.5" /> Duplicate (Disqualified)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-between shadow-sm">
                  <span className="text-white font-bold">Bidder 3: 0.25 ETB</span>
                  <span className="text-emerald-300 font-bold text-xs flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WINNER! Lowest Unique
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between border border-slate-800">
                  <span className="text-slate-400">Bidder 4: 0.50 ETB</span>
                  <span className="text-amber-400 text-[11px] flex items-center gap-1 font-sans">
                    Unique, but 0.25 ETB is lower
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between border border-slate-800">
                  <span className="text-slate-400">Bidder 5: 0.50 ETB</span>
                  <span className="text-rose-400 text-[11px] flex items-center gap-1 font-sans">
                    <XCircle className="w-3.5 h-3.5" /> Duplicate (Disqualified)
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed font-sans">
                <strong>Result:</strong> Bidder 3 wins the prize and pays <strong>ONLY 0.25 ETB</strong> to take it home!
              </div>
            </div>

            {/* Step-by-Step Points */}
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-white">Pick a Prize Drop</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Browse Cash Drops, Brand New Cars, or Flagship Tech gadgets.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-white">Pay the Small Bid Fee</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Each attempt costs a flat entry fee (e.g. 15, 35, or 100 ETB) paid via Telebirr or CBE.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-white">Enter Your Secret Unique Amount</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Strategize to find the lowest decimal value that no other player duplicates.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <p className="font-bold text-white">Claim Your Prize</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    If you hold the lowest unique bid when the countdown closes, you pay only that winning bid amount to claim the prize!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              Start Bidding Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
