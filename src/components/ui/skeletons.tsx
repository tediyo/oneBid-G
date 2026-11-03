import React from 'react';

export function AuctionCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-slate-800/80 skeleton-shimmer w-full" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-slate-800 rounded skeleton-shimmer" />
        <div className="h-5 w-3/4 bg-slate-800 rounded skeleton-shimmer" />
        <div className="h-3 w-full bg-slate-800 rounded skeleton-shimmer" />
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <div className="h-4 w-16 bg-slate-800 rounded skeleton-shimmer" />
          <div className="h-8 w-24 bg-slate-800 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function AuctionDetailsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-[16/10] bg-slate-800/80 rounded-2xl skeleton-shimmer w-full" />
      <div className="h-6 w-3/4 bg-slate-800 rounded skeleton-shimmer" />
      <div className="h-4 w-1/2 bg-slate-800 rounded skeleton-shimmer" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-slate-800/60 rounded-xl skeleton-shimmer" />
        <div className="h-20 bg-slate-800/60 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/80 animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-slate-800 rounded skeleton-shimmer" />
            <div className="h-3 w-1/2 bg-slate-800 rounded skeleton-shimmer" />
          </div>
          <div className="h-8 w-20 bg-slate-800 rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

