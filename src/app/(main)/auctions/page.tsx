'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { AuctionCard } from '@/components/ui/auction-card';
import { AuctionCardSkeleton } from '@/components/ui/skeletons';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'closed', label: 'Closed' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'cash', label: '💰 Cash Drops' },
  { id: 'cars', label: '🚗 Cars & Motors' },
  { id: 'tech', label: '📱 Tech & Gadgets' },
  { id: 'appliances', label: '🏠 Appliances' },
  { id: 'vouchers', label: '🎟️ Vouchers' },
];

export default function AuctionsCatalogPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data, isLoading, error } = useQuery({
    queryKey: ['auctions', statusFilter, categoryFilter, search],
    queryFn: () =>
      apiClient.getAuctions({
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: search.trim() || undefined,
      }),
  });

  const auctions = data?.auctions ?? [];

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters = search !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Auction Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse active, upcoming, and finished lowest-unique-bid prize drops.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items by name or description..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Category Horizontal Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-800 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Auctions Grid / Skeletons / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuctionCardSkeleton />
          <AuctionCardSkeleton />
          <AuctionCardSkeleton />
          <AuctionCardSkeleton />
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-rose-300">Failed to load auctions</p>
          <p className="text-xs text-slate-400">Please check your network and try again.</p>
        </div>
      ) : auctions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">No auctions match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try adjusting your search query, status tab, or category filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}

