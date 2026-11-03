'use client';

import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, Award, Share2, Copy, Flame } from 'lucide-react';
import { formatETB } from '@/lib/utils/currency';

export default function RewardsPage() {
  const [claimedToday, setClaimedToday] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const referralCode = 'MINI-ABEBE-88';

  const handleClaimDaily = () => {
    setClaimedToday(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://minibid.et/join?ref=${referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handleSpin = () => {
    if (spinning || spinResult) return;
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setSpinResult('🎉 You won +3 FREE Bid Attempts!');
    }, 1800);
  };

  const streakDays = [
    { day: 'Day 1', reward: '+1 Bid', done: true },
    { day: 'Day 2', reward: '+1 Bid', done: true },
    { day: 'Day 3', reward: '+2 Bids', done: true },
    { day: 'Day 4', reward: '+2 Bids', current: true },
    { day: 'Day 5', reward: '+3 Bids' },
    { day: 'Day 6', reward: '+4 Bids' },
    { day: 'Day 7', reward: '50 ETB Bonus', special: true },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Rewards & Free Attempts
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Earn free bids, claim daily streak bonuses, and level up your bidder badge.
        </p>
      </div>

      {/* Daily Streak Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
            <h3 className="font-extrabold text-sm text-white">Daily Check-in Streak</h3>
          </div>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full">
            3-Day Streak 🔥
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {streakDays.map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl text-center border transition-all ${
                item.done
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : item.current
                  ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold block">{item.day}</span>
              <span className="text-[10px] font-extrabold mt-1 block truncate">
                {item.reward}
              </span>
              {item.done && <CheckCircle2 className="w-3 h-3 text-emerald-400 mx-auto mt-1" />}
            </div>
          ))}
        </div>

        <button
          onClick={handleClaimDaily}
          disabled={claimedToday}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          {claimedToday ? '✓ Claimed Today (Come back tomorrow!)' : 'Claim Day 4 Reward (+2 Bids)'}
        </button>
      </div>

      {/* Daily Lucky Attempt Box */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">Daily Mystery Box</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">1 Free Spin per 24h</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Open the Mini-Bid mystery container to win between 1 to 10 free bids or wallet credits!
        </p>

        {spinResult ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-slide-up">
            {spinResult}
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {spinning ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Unlocking Mystery Reward...</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Open Mystery Box Now</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Referral Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-amber-400" />
          <h3 className="font-extrabold text-sm text-white">Invite Friends & Earn</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Share your referral invite link. Whenever a friend places their first bid, you both receive
          5 bonus attempts for free!
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`https://minibid.et/join?ref=${referralCode}`}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            {copiedReferral ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReferral ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

