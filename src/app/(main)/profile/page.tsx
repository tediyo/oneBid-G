'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  Sparkles,
  Smartphone,
  ChevronLeft,
  CreditCard,
  Plus,
  LogOut,
  Building,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatETB } from '@/lib/utils/currency';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'wallet';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Query Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => apiClient.getUserProfile(),
  });

  // Profile Edit State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Preferences State
  const [preferences, setPreferences] = useState({
    smsOnOutbid: true,
    telegramAlerts: true,
    emailDropDigest: false,
    soundEffects: true,
  });

  // Wallet Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmountETB, setDepositAmountETB] = useState('200');
  const [selectedProvider, setSelectedProvider] = useState<'telebirr' | 'cbe'>('telebirr');

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      if (profile.preferences) {
        setPreferences(profile.preferences);
      }
    }
  }, [profile]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: { fullName: string; email?: string; city?: string; phone?: string }) =>
      apiClient.updateUserProfile(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user-profile'], updated);
      setProfileErrorMsg(null);
      setProfileSuccessMsg('Profile information successfully saved!');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setProfileErrorMsg(err.message || 'Failed to update profile.');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => apiClient.changePassword(data),
    onSuccess: (data) => {
      setPasswordErrorMsg(null);
      setPasswordSuccessMsg(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(null), 4000);
    },
    onError: (err: any) => {
      setPasswordErrorMsg(err.message || 'Failed to change password.');
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (prefs: Partial<typeof preferences>) => apiClient.updatePreferences(prefs),
    onSuccess: (updated) => {
      setPreferences(updated);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  const depositMutation = useMutation({
    mutationFn: (subunits: number) => apiClient.depositFunds(subunits, selectedProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setShowDepositModal(false);
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    if (!fullName.trim()) {
      setProfileErrorMsg('Full name cannot be empty.');
      return;
    }
    updateProfileMutation.mutate({
      fullName,
      email,
      phone,
      city,
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    if (!currentPassword) {
      setPasswordErrorMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirmation do not match.');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  const handleTogglePref = (key: keyof typeof preferences) => {
    const nextVal = !preferences[key];
    const updated = { ...preferences, [key]: nextVal };
    setPreferences(updated);
    updatePreferencesMutation.mutate({ [key]: nextVal });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(depositAmountETB);
    if (isNaN(parsed) || parsed <= 0) return;
    const subunits = Math.round(parsed * 100);
    depositMutation.mutate(subunits);
  };

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500 text-rose-400' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500 text-amber-400' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500 text-blue-400' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500 text-emerald-400' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {/* Header Back & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider">
          Account Settings
        </span>
      </div>

      {/* User Hero & Balance Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#101726] to-slate-900 border border-slate-800 p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-500/20">
                {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#090d16] flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {fullName || 'Abebe Kebede'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Fayda Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{phone || '+251 91 123 4567'}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <Building className="w-3 h-3" /> {city || 'Addis Ababa, Ethiopia'}
              </p>
            </div>
          </div>

          {/* Wallet Balance Card in Subunits */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1 sm:justify-end">
                <Wallet className="w-3.5 h-3.5 text-amber-400" /> Wallet Balance
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
                {profile ? formatETB(profile.walletBalanceUnits) : '2,500.00 ETB'}
              </div>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Funds</span>
            </button>
          </div>
        </div>

        {/* Quick Link to My Bids */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Active in <strong className="text-white">{profile?.activeBidsCount ?? 12}</strong> live
            drop bids
          </span>
          <Link
            href="/my-bids"
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
          >
            <span>Open Secret Bids Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Edit Profile', icon: User },
          { id: 'security', label: 'Password & Security', icon: KeyRound },
          { id: 'notifications', label: 'Alerts', icon: Bell },
          { id: 'wallet', label: 'Payment Methods', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: EDIT PROFILE ================= */}
      {activeTab === 'profile' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" /> Personal Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your verified profile identity. This name is used for official prize handover
              verification.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abebe Kebede"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
              <span className="text-[11px] text-slate-500 block">
                Must match your government-issued ID for claiming won prizes.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Phone Number (Login)</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. abebe@ethio.et"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">City & Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Addis Ababa (Bole Subcity) or Adama"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* National ID Compliance Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-300 block">
                  Ethiopian National ID (Fayda / Kebele)
                </span>
                <span className="text-slate-400 mt-0.5 block leading-relaxed font-mono">
                  {profile?.nationalIdNumber || 'ET-FAYDA-9482-1084'} • Verified & Encrypted
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Information</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 2: PASSWORD & SECURITY ================= */}
      {activeTab === 'security' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" /> Change Account Password
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure your bidder account with a strong and unique password.
            </p>
          </div>

          {passwordSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}

          {passwordErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{passwordErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Current Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                New Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="pt-1 space-y-1">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                      style={{ width: `${pwdStrength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Password strength:</span>
                    <span className="font-bold">{pwdStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Confirm New Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending || !currentPassword || !newPassword}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Active Session Info */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <h3 className="text-xs font-bold text-slate-300">Security Sessions</h3>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">Current Web Session</p>
                <p className="text-[11px] text-slate-500">Windows • Addis Ababa, Ethiopia</p>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active Now
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: NOTIFICATIONS & ALERTS ================= */}
      {activeTab === 'notifications' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Bid Alerts & Notification Preferences
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Control how you receive status updates regarding your lowest unique bids.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'smsOnOutbid',
                title: 'Instant SMS on Outbid / Duplicate Collision',
                desc: 'Receive immediate SMS if another user places your exact amount.',
              },
              {
                key: 'telegramAlerts',
                title: 'Telegram Mini-Bid Bot Alerts',
                desc: 'Real-time countdown closing warnings and bid receipt confirmations.',
              },
              {
                key: 'emailDropDigest',
                title: 'Weekly Drop Announcements (Email)',
                desc: 'Previews of upcoming high-value flagship prizes before they launch.',
              },
              {
                key: 'soundEffects',
                title: 'In-App Sound Effects',
                desc: 'Play sound confirmation when submitting secret bids or claiming rewards.',
              },
            ].map((item) => {
              const isChecked = preferences[item.key as keyof typeof preferences];
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePref(item.key as keyof typeof preferences)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isChecked ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: WALLET & PAYMENT METHODS ================= */}
      {activeTab === 'wallet' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" /> Ethiopian Payment Gateways
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Connected accounts for buying bid packages and automatic prize cashouts.
              </p>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Deposit
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Telebirr */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-sm border border-blue-500/30">
                  tb
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">Telebirr SuperApp</h4>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/30">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">+251 91 123 4567</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400">Linked ✓</span>
            </div>

            {/* CBE Birr */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black text-sm border border-purple-500/30">
                  CBE
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Commercial Bank of Ethiopia</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Account: 1000 **** 8421</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout Action */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to log out of your session?')) {
              router.push('/');
            }
          }}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {/* ================= WALLET DEPOSIT MODAL ================= */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">Add Funds (Subunits Wallet)</h3>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Top up your balance instantly via Telebirr or CBE Birr to purchase bid packages.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Deposit Amount in ETB</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={depositAmountETB}
                    onChange={(e) => setDepositAmountETB(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-400 transition-colors"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                    ETB
                  </span>
                </div>

                {/* Subunits breakdown */}
                {depositAmountETB && !isNaN(parseFloat(depositAmountETB)) && (
                  <div className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex justify-between">
                    <span>Credit Subunits:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {Math.round(parseFloat(depositAmountETB) * 100)} subunits
                    </span>
                  </div>
                )}

                {/* Preset Chips */}
                <div className="flex items-center gap-2 pt-1">
                  {['100', '250', '500', '1000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmountETB(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700/60"
                    >
                      {amt} ETB
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Gateway Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">Select Gateway</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider('telebirr')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProvider === 'telebirr'
                        ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">Telebirr</span>
                    <span className="text-[10px]">Instant USSD Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProvider('cbe')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProvider === 'cbe'
                        ? 'bg-purple-500/15 border-purple-500 text-purple-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">CBE Birr</span>
                    <span className="text-[10px]">Direct Transfer</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={depositMutation.isPending}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                {depositMutation.isPending ? 'Processing Deposit...' : 'Confirm Deposit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

