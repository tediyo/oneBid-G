'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gavel, Radio, Trophy, Gift } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isLive?: boolean;
}

// EXACTLY 5 tabs in this order: Home, Auctions, Live, Results, Rewards
const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Auctions', href: '/auctions', icon: Gavel },
  { name: 'Live', href: '/live', icon: Radio, isLive: true },
  { name: 'Results', href: '/results', icon: Trophy },
  { name: 'Rewards', href: '/rewards', icon: Gift },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-3xl mx-auto px-2">
        <ul className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center w-full h-full py-1.5 transition-all relative group',
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform group-hover:scale-110',
                        isActive && 'scale-110 stroke-[2.4px]'
                      )}
                    />
                    {item.isLive && (
                      <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[11px] mt-1 tracking-tight',
                      isActive ? 'text-amber-400 font-bold' : 'text-slate-400'
                    )}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

