'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '@/lib/hooks/use-countdown';
import { cn } from '@/lib/utils/cn';

interface CountdownBadgeProps {
  closesAt: string;
  serverTime?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownBadge({
  closesAt,
  serverTime,
  className,
  size = 'md',
}: CountdownBadgeProps) {
  const timeLeft = useCountdown(closesAt, serverTime);

  const isUrgent = !timeLeft.isExpired && timeLeft.totalSeconds < 3600; // Under 1 hour

  if (timeLeft.isExpired) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700/60',
          className
        )}
      >
        <Clock className="w-3.5 h-3.5" /> Closed
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-mono tracking-tight font-bold transition-colors',
        isUrgent
          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse'
          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        size === 'md' && 'px-2.5 py-1 text-xs',
        size === 'lg' && 'px-3.5 py-1.5 text-sm',
        className
      )}
    >
      <Clock className={cn('w-3.5 h-3.5', size === 'lg' && 'w-4 h-4')} />
      <span>{timeLeft.formatted}</span>
    </span>
  );
}

