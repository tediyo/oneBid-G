/**
 * Core Domain Types for Minimum-Bid (Lowest Unique Bid) Auction System
 * All monetary amounts are represented in integer subunits (1 unit = 0.01 ETB).
 * Floating points are strictly avoided in calculations and domain state.
 */

export type AuctionStatus =
  | 'scheduled'
  | 'live'
  | 'closed'
  | 'calculating'
  | 'result_published'
  | 'rerun_scheduled'
  | 'cancelled';

export type AuctionCategory =
  | 'cash'
  | 'cars'
  | 'tech'
  | 'appliances'
  | 'vouchers'
  | 'smartphones'
  | 'electronics'
  | 'vehicles';

export interface Auction {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: AuctionCategory;
  imageUrl: string;
  galleryUrls: string[];
  retailPriceUnits: number; // in 0.01 ETB (e.g. 18000000 = 180,000.00 ETB)
  bidFeeUnits: number; // cost per bid in subunits (e.g. 500 = 5.00 ETB)
  maxBidLimitUnits: number; // e.g. 50000 = 500.00 ETB maximum allowable bid ceiling
  minBidIncrementUnits: number; // always 1 subunit (0.01 ETB)
  status: AuctionStatus;
  startsAt: string; // ISO 8601 UTC
  closesAt: string; // ISO 8601 UTC
  serverTime: string; // ISO 8601 UTC timestamp from backend for clock sync
  totalBidsCount: number;
  uniqueBidsRatioEstimate?: number; // sanitized non-revealing stat
  featured?: boolean;
  terms: string[];
  winnerAnnounceAt?: string;
  rerunReason?: string;
}

export interface AttemptPackage {
  id: string;
  auctionId?: string; // specific auction or universal
  name: string;
  bidsCount: number;
  priceUnits: number; // in 0.01 ETB
  bonusBidsCount: number;
  popular?: boolean;
  bestValue?: boolean;
}

export interface UserAttemptBalance {
  auctionId: string;
  availableAttempts: number;
  purchasedAttempts: number;
  consumedAttempts: number;
}

export type PersonalBidStatus =
  | 'submitted'
  | 'unique_lowest'
  | 'unique_not_lowest'
  | 'duplicate'
  | 'outbid'
  | 'won'
  | 'lost';

export interface UserBid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  amountUnits: number; // visible only to the user who placed it
  placedAt: string; // ISO 8601 UTC
  status: PersonalBidStatus;
  idempotencyKey: string;
}

export interface BidSubmission {
  auctionId: string;
  amountUnits: number; // integer subunits (0.01 ETB)
  idempotencyKey: string;
}

export interface BidSubmissionResponse {
  success: boolean;
  bidId: string;
  auctionId: string;
  amountUnits: number;
  placedAt: string;
  remainingAttempts: number;
  status: PersonalBidStatus;
  message: string;
}

export interface AuctionResult {
  auctionId: string;
  auctionTitle: string;
  imageUrl: string;
  retailPriceUnits: number;
  winningAmountUnits: number | null; // null if no unique bid exists
  winnerDisplayName: string | null; // e.g. "Dawit ***" or null if rerun
  winnerCity?: string | null;
  totalParticipants: number;
  totalBidsPlaced: number;
  hasWinner: boolean;
  status: 'result_published' | 'rerun_scheduled' | 'calculating';
  publishedAt: string;
  rerunDate?: string | null;
  rerunNote?: string;
}

export type LiveFeedEventType =
  | 'bid_placed'
  | 'auction_started'
  | 'closing_soon'
  | 'auction_ended'
  | 'winner_crowned';

export interface LiveFeedEvent {
  id: string;
  type: LiveFeedEventType;
  auctionId: string;
  auctionTitle: string;
  timestamp: string; // ISO 8601 UTC
  // Safe sanitized message: NEVER reveals exact bid amounts or full identities!
  displayMessage: string;
  avatarSeed?: string;
  city?: string; // generic regional detail e.g. "Addis Ababa"
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'bid_update' | 'auction_alert' | 'wallet' | 'reward';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface UserNotificationPreferences {
  smsOnOutbid: boolean;
  telegramAlerts: boolean;
  emailDropDigest: boolean;
  soundEffects: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  nationalIdVerified: boolean;
  nationalIdNumber?: string;
  preferredPaymentMethod?: 'telebirr' | 'cbe' | 'chapa';
  walletBalanceUnits: number;
  activeBidsCount: number;
  unreadNotificationsCount: number;
  preferences: UserNotificationPreferences;
}

export interface UpdateProfilePayload {
  fullName: string;
  email?: string;
  city?: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


