'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gavel, Tag, Users } from 'lucide-react';
import { Auction } from '@/lib/types/auction';
import { formatETB } from '@/lib/utils/currency';
import { AuctionStatusBadge } from '@/components/ui/status-badge';
import { CountdownBadge } from '@/components/ui/countdown-badge';

export function AuctionCard({ auction }: { auction: Auction }) {
  const isLive = auction.status === 'live';

  return (
    <div className="group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col">
      {/* Image & Badges Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={auction.imageUrl}
          alt={auction.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <AuctionStatusBadge status={auction.status} />
          {isLive && (
            <CountdownBadge
              closesAt={auction.closesAt}
              serverTime={auction.serverTime}
              size="sm"
            />
          )}
        </div>

        {/* Retail Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
            <span className="text-slate-400">Retail: </span>
            <span className="font-bold text-white">{formatETB(auction.retailPriceUnits)}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
            <Users className="w-3 h-3 text-amber-400" />
            <span className="font-semibold">{auction.totalBidsCount}</span>
            <span className="text-slate-400 text-[10px]">bids</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-amber-400 uppercase font-bold tracking-wider mb-1">
            <Tag className="w-3 h-3" />
            <span>{auction.category}</span>
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {auction.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {auction.shortDescription}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">
              Bid Entry Fee
            </span>
            <span className="text-xs font-bold text-slate-200">
              {formatETB(auction.bidFeeUnits)}
            </span>
          </div>

          <Link
            href={`/auctions/${auction.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>{isLive ? 'Bid Now' : 'View Details'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

