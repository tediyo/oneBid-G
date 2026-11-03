'use client';

import React, { useState, useId } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gavel,
  Clock,
  ShieldCheck,
  Sparkles,
  Package,
  Plus,
  AlertTriangle,
  CheckCircle2,
  X,
  Info,
  ChevronLeft,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB, parseETBInputToUnits } from '@/lib/utils/currency';
import { AuctionStatusBadge, PersonalBidStatusBadge } from '@/components/ui/status-badge';
import { CountdownBadge } from '@/components/ui/countdown-badge';
import { AuctionDetailsSkeleton } from '@/components/ui/skeletons';
import { formatRelativeTime } from '@/lib/utils/time';

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const auctionId = params.id as string;

  // Modals state
  const [showBidModal, setShowBidModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Bid form state
  const [bidInput, setBidInput] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidSuccessBanner, setBidSuccessBanner] = useState<string | null>(null);

  // Queries
  const { data: auction, isLoading, error } = useQuery({
    queryKey: ['auction', auctionId],
    queryFn: () => apiClient.getAuctionById(auctionId),
  });

  const { data: packageData } = useQuery({
    queryKey: ['auction-packages', auctionId],
    queryFn: () => apiClient.getAuctionPackages(auctionId),
  });

  const { data: myBids } = useQuery({
    queryKey: ['my-bids', auctionId],
    queryFn: () => apiClient.getMyBids(auctionId),
  });

  const availableAttempts = packageData?.availableAttempts ?? 0;
  const packages = packageData?.packages ?? [];

  // Bid submission mutation with idempotency
  const submitBidMutation = useMutation({
    mutationFn: async (amountUnits: number) => {
      // Generate a fresh unique idempotency key for this submission attempt
      const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return apiClient.submitBid(auctionId, {
        auctionId,
        amountUnits,
        idempotencyKey,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auction-packages', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
      queryClient.invalidateQueries({ queryKey: ['my-bids', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['live-events'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setShowBidModal(false);
      setBidInput('');
      setBidError(null);
      setBidSuccessBanner(data.message || 'Bid successfully recorded!');
      setTimeout(() => setBidSuccessBanner(null), 5000);
    },
    onError: (err: any) => {
      setBidError(err.message || 'Failed to place bid.');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Package purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return apiClient.purchasePackage(auctionId, packageId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auction-packages', auctionId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setShowPackageModal(false);
      setBidSuccessBanner(`Added ${data.addedAttempts} bid attempts to your account!`);
      setTimeout(() => setBidSuccessBanner(null), 4000);
    },
  });

  const handlePlaceBid = () => {
    if (isSubmitting) return; // Prevent double-tap
    setBidError(null);

    const units = parseETBInputToUnits(bidInput);
    if (units === null || units <= 0) {
      setBidError('Please enter a valid amount (e.g. 0.45 or 1.20 ETB).');
      return;
    }

    if (auction && units > auction.maxBidLimitUnits) {
      setBidError(`Amount exceeds the maximum limit of ${formatETB(auction.maxBidLimitUnits)}.`);
      return;
    }

    if (availableAttempts <= 0) {
      setBidError('You have no attempts left. Purchase a bid package to place bids.');
      return;
    }

    setIsSubmitting(true);
    submitBidMutation.mutate(units);
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <AuctionDetailsSkeleton />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <p className="text-rose-400 font-bold">Auction not found</p>
        <Link
          href="/auctions"
          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Back to auctions
        </Link>
      </div>
    );
  }

  const isLive = auction.status === 'live';
  const gallery = [auction.imageUrl, ...(auction.galleryUrls || [])];

  return (
    <div className="space-y-5">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <AuctionStatusBadge status={auction.status} />
      </div>

      {/* Success Banner */}
      {bidSuccessBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-slide-up shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bidSuccessBanner}</span>
        </div>
      )}

      {/* Gallery & Hero Image */}
      <div className="space-y-2">
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <Image
            src={gallery[activeImageIdx] || auction.imageUrl}
            alt={auction.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Countdown & Live Indicator */}
          {isLive && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <CountdownBadge
                closesAt={auction.closesAt}
                serverTime={auction.serverTime}
                size="md"
              />
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-200 border border-white/10">
                {auction.totalBidsCount} total bids
              </div>
            </div>
          )}
        </div>

        {/* Gallery Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden border transition-all ${
                  activeImageIdx === idx
                    ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title & Valuation Box */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            {auction.category}
          </span>
          <span className="text-[11px] text-slate-400">ID: {auction.id}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
          {auction.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {auction.description}
        </p>

        {/* Key Pricing Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Retail Value</span>
            <span className="text-sm sm:text-base font-extrabold text-white">
              {formatETB(auction.retailPriceUnits)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Bid Fee / Attempt</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400">
              {formatETB(auction.bidFeeUnits)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-medium">Max Bid Ceiling</span>
            <span className="text-sm sm:text-base font-extrabold text-slate-300">
              {formatETB(auction.maxBidLimitUnits)}
            </span>
          </div>
        </div>
      </div>

      {/* Attempts & Action Control Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-[#101726] border border-amber-500/20 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Your Available Attempts
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black text-white">{availableAttempts}</span>
              <span className="text-xs text-slate-400">attempts remaining</span>
            </div>
          </div>

          <button
            onClick={() => setShowPackageModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buy Attempts</span>
          </button>
        </div>

        {availableAttempts === 0 && isLive && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>You have 0 attempts left for this auction.</span>
            </div>
            <button
              onClick={() => setShowPackageModal(true)}
              className="font-bold underline text-amber-400 whitespace-nowrap"
            >
              Get Attempts
            </button>
          </div>
        )}

        {/* Primary Bid Button */}
        {isLive ? (
          <button
            onClick={() => {
              if (availableAttempts <= 0) {
                setShowPackageModal(true);
              } else {
                setShowBidModal(true);
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Gavel className="w-4 h-4 fill-slate-950" />
            <span>Place Strategic Lowest Bid</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 font-bold text-center text-xs">
            Bidding is currently closed for this drop
          </div>
        )}

        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-[11px] text-amber-200">
          💡 If you hold the lowest unique bid when this auction closes, you only pay your winning bid amount!
        </div>
      </div>

      {/* Rules Summary Accordion */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Lowest Unique Bid Rules
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          {auction.terms.map((term, i) => (
            <li key={i} className="leading-relaxed">
              {term}
            </li>
          ))}
        </ul>
      </div>

      {/* User's Personal Bids for This Auction */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white">Your Placed Bids on this Prize</h3>
          <Link href="/my-bids" className="text-xs font-semibold text-amber-400 hover:underline">
            View full ledger &rarr;
          </Link>
        </div>

        {myBids && myBids.length > 0 ? (
          <div className="space-y-2">
            {myBids.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-amber-300">
                      {formatETB(b.amountUnits)}
                    </span>
                    <PersonalBidStatusBadge status={b.status} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Placed {formatRelativeTime(b.placedAt)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">1 attempt</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500">
            You haven’t placed any bids on this auction yet.
          </div>
        )}
      </div>

      {/* ================= BID SUBMISSION MODAL ================= */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Place Secret Bid</h3>
              </div>
              <button
                onClick={() => {
                  setShowBidModal(false);
                  setBidError(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Prize Summary */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium truncate max-w-[200px]">
                {auction.title}
              </span>
              <span className="text-amber-400 font-bold">1 Attempt cost</span>
            </div>

            {/* Input Form with Subunits Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Bid Amount in ETB (0.01 increments)
              </label>

              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={bidInput}
                  onChange={(e) => {
                    setBidInput(e.target.value);
                    setBidError(null);
                  }}
                  placeholder="e.g. 0.47 or 1.15"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs text-amber-400">
                  ETB
                </span>
              </div>

              {/* Subunits Preview Helper */}
              {bidInput && parseETBInputToUnits(bidInput) !== null && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span>Integer Subunit:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {parseETBInputToUnits(bidInput)} units (0.01 ETB base)
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 font-semibold flex items-center justify-between">
                    <span>If this wins, you pay:</span>
                    <span className="font-mono font-bold">{bidInput} ETB</span>
                  </div>
                </div>
              )}

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 font-medium mr-1">Quick Add:</span>
                {['0.01', '0.07', '0.23', '0.47', '0.89', '1.14'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBidInput(val)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700/60"
                  >
                    {val} ETB
                  </button>
                ))}
              </div>

              {bidError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{bidError}</span>
                </div>
              )}
            </div>

            {/* Privacy notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Your bid amount is strictly private and hidden from other players. Only you can view
                it in your private ledger.
              </span>
            </div>

            {/* Submit Button with Double-tap Prevention */}
            <button
              type="button"
              disabled={isSubmitting || !bidInput}
              onClick={handlePlaceBid}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Securing & Registering Bid...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4 fill-slate-950" />
                  <span>Confirm Bid Submission</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ================= PURCHASE PACKAGES MODAL ================= */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Purchase Bid Attempts</h3>
              </div>
              <button
                onClick={() => setShowPackageModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Each attempt gives you 1 secret bid entry on this auction. Bundles include bonus
              attempts!
            </p>

            <div className="space-y-2.5">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    pkg.popular
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{pkg.name}</h4>
                      {pkg.popular && (
                        <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full">
                          POPULAR
                        </span>
                      )}
                      {pkg.bestValue && (
                        <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pkg.bidsCount} bids
                      {pkg.bonusBidsCount > 0 && (
                        <span className="text-emerald-400 font-semibold">
                          {' '}
                          + {pkg.bonusBidsCount} BONUS
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    disabled={purchaseMutation.isPending}
                    onClick={() => purchaseMutation.mutate(pkg.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {purchaseMutation.isPending ? '...' : formatETB(pkg.priceUnits)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

