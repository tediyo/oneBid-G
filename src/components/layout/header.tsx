'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bell, Search, User, Wallet, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';
import { formatRelativeTime } from '@/lib/utils/time';

export function Header() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => apiClient.getUserProfile(),
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.getNotifications(),
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 3;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-slate-950 text-lg tracking-tighter">1</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">ONE<span className="text-amber-400">BID</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ET
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium -mt-1">Cash, Cars & Tech</span>
            </div>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => router.push('/auctions')}
              aria-label="Search auctions"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications with Badge */}
            <button
              onClick={() => setShowNotifications(true)}
              aria-label="View notifications"
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm ring-2 ring-[#090d16]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with Balance Pill */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-800/70 border border-slate-700/60 hover:border-amber-500/50 transition-all text-left"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-medium">Balance</span>
                <span className="text-xs font-bold text-amber-400">
                  {profile ? formatETB(profile.walletBalanceUnits) : '2,500.00 ETB'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-800 shadow">
                <User className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl mt-14 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Notifications</h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-800/60 flex-1 my-2">
              {notifications?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setShowNotifications(false);
                    if (item.link) router.push(item.link);
                  }}
                  className={`p-3 rounded-xl transition-colors cursor-pointer hover:bg-slate-800/40 my-1 ${
                    !item.read ? 'bg-slate-800/25 border-l-2 border-amber-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 px-3 py-1.5"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Wallet Drawer Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-2xl mt-14 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Bidder Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-4">
              {/* User Card */}
              <div
                onClick={() => {
                  setShowProfileModal(false);
                  router.push('/profile');
                }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                  {profile?.fullName.charAt(0) ?? 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    {profile?.fullName ?? 'Abebe Kebede'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{profile?.phone ?? '+251 91 123 4567'}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Fayda Verified
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Settings & Password Change Shortcut */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  router.push('/profile');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-800/60 to-slate-800/60 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-left transition-all group"
              >
                <div>
                  <p className="text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                    ⚙️ Profile Settings & Password
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Edit name, phone, change password, KYC & notifications
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Wallet Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-200/80 font-medium flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-400" /> Wallet Balance
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400/80 bg-amber-500/15 px-1.5 py-0.5 rounded">
                    Subunits Mode
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-white tracking-tight">
                  {profile ? formatETB(profile.walletBalanceUnits) : '2,500.00 ETB'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Available for purchasing bid attempt bundles.
                </p>
              </div>

              {/* Crucial UX Link: My Bids shortcut inside Profile */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  router.push('/my-bids');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-left transition-all group"
              >
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    My Bids Ledger
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    View private bid values, status & attempts
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => {
                  setShowProfileModal(false);
                  router.push('/rewards');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-left transition-all group"
              >
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Daily Rewards & Spin
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Claim daily free attempts & streak points
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

