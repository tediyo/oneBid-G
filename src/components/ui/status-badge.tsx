import React from 'react';
import { AuctionStatus, PersonalBidStatus } from '@/lib/types/auction';
import { cn } from '@/lib/utils/cn';

export function AuctionStatusBadge({ status }: { status: AuctionStatus }) {
  switch (status) {
    case 'live':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE NOW
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          UPCOMING
        </span>
      );
    case 'calculating':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          CALCULATING
        </span>
      );
    case 'result_published':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          WINNER PUBLISHED
        </span>
      );
    case 'rerun_scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          RERUN SCHEDULED
        </span>
      );
    case 'closed':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
          CLOSED
        </span>
      );
  }
}

export function PersonalBidStatusBadge({ status }: { status: PersonalBidStatus }) {
  switch (status) {
    case 'unique_lowest':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
          ★ UNIQUE & LOWEST
        </span>
      );
    case 'unique_not_lowest':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          UNIQUE (NOT LOWEST)
        </span>
      );
    case 'duplicate':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
          DUPLICATE AMOUNT
        </span>
      );
    case 'won':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-yellow-300 border border-amber-400/50">
          🏆 WON PRIZE
        </span>
      );
    case 'lost':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
          LOST
        </span>
      );
    case 'outbid':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30">
          OUTBID
        </span>
      );
    case 'submitted':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
          SUBMITTED
        </span>
      );
  }
}

