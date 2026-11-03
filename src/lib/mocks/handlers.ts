import {
  Auction,
  AttemptPackage,
  AuctionResult,
  BidSubmission,
  BidSubmissionResponse,
  LiveFeedEvent,
  UserBid,
  UserProfile,
  UserNotification,
} from '@/lib/types/auction';
import {
  INITIAL_AUCTIONS,
  INITIAL_ATTEMPT_PACKAGES,
  INITIAL_USER_BIDS,
  INITIAL_RESULTS,
  INITIAL_LIVE_EVENTS,
  INITIAL_USER_PROFILE,
} from './data';

// In-memory session state for realistic client interactions
class MockStore {
  private auctions: Auction[] = [...INITIAL_AUCTIONS];
  private attemptPackages: AttemptPackage[] = [...INITIAL_ATTEMPT_PACKAGES];
  private userBids: UserBid[] = [...INITIAL_USER_BIDS];
  private results: AuctionResult[] = [...INITIAL_RESULTS];
  private liveEvents: LiveFeedEvent[] = [...INITIAL_LIVE_EVENTS];
  private userProfile: UserProfile = { ...INITIAL_USER_PROFILE };
  private userAttemptsMap: Record<string, number> = {
    auc_iphone16: 6,
    auc_macbook_m3: 3,
    auc_pulsar_ns200: 10,
    auc_ps5_slim: 0,
    auc_samsung_tv: 5,
  };
  private processedIdempotencyKeys: Map<string, BidSubmissionResponse> = new Map();

  // Simulate network latency (250ms - 500ms)
  private async delay(ms: number = 250): Promise<void> {
    await new Promise((res) => setTimeout(res, ms));
  }

  // Always returns authoritative fresh server time
  private getCurrentServerTime(): string {
    return new Date().toISOString();
  }

  async getAuctions(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ auctions: Auction[]; serverTime: string }> {
    await this.delay(200);
    const nowIso = this.getCurrentServerTime();

    let list = this.auctions.map((a) => ({
      ...a,
      serverTime: nowIso,
    }));

    if (params?.status) {
      if (params.status === 'live') {
        list = list.filter((a) => a.status === 'live');
      } else if (params.status === 'upcoming') {
        list = list.filter((a) => a.status === 'scheduled');
      } else if (params.status === 'closed') {
        list = list.filter((a) => ['closed', 'calculating', 'result_published'].includes(a.status));
      }
    }

    if (params?.category && params.category !== 'all') {
      list = list.filter((a) => a.category === params.category);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q)
      );
    }

    return { auctions: list, serverTime: nowIso };
  }

  async getAuctionById(id: string): Promise<Auction> {
    await this.delay(150);
    const auc = this.auctions.find((a) => a.id === id);
    if (!auc) {
      throw new Error(`Auction with id "${id}" not found.`);
    }
    return {
      ...auc,
      serverTime: this.getCurrentServerTime(),
    };
  }

  async getAuctionPackages(auctionId: string): Promise<{
    packages: AttemptPackage[];
    availableAttempts: number;
  }> {
    await this.delay(150);
    const available = this.userAttemptsMap[auctionId] ?? 5;
    return {
      packages: this.attemptPackages,
      availableAttempts: available,
    };
  }

  async purchasePackage(
    auctionId: string,
    packageId: string
  ): Promise<{ success: boolean; newBalance: number; addedAttempts: number }> {
    await this.delay(350);
    const pkg = this.attemptPackages.find((p) => p.id === packageId);
    if (!pkg) {
      throw new Error(`Package "${packageId}" not found.`);
    }

    const totalAdded = pkg.bidsCount + pkg.bonusBidsCount;
    const current = this.userAttemptsMap[auctionId] ?? 0;
    const updated = current + totalAdded;
    this.userAttemptsMap[auctionId] = updated;

    // Deduct cost from wallet balance
    if (this.userProfile.walletBalanceUnits >= pkg.priceUnits) {
      this.userProfile.walletBalanceUnits -= pkg.priceUnits;
    }

    return {
      success: true,
      newBalance: updated,
      addedAttempts: totalAdded,
    };
  }

  async submitBid(
    auctionId: string,
    submission: BidSubmission
  ): Promise<BidSubmissionResponse> {
    await this.delay(350);

    // 1. Check idempotency key to prevent double submits
    if (this.processedIdempotencyKeys.has(submission.idempotencyKey)) {
      return this.processedIdempotencyKeys.get(submission.idempotencyKey)!;
    }

    const auction = this.auctions.find((a) => a.id === auctionId);
    if (!auction) {
      throw new Error(`Auction "${auctionId}" not found.`);
    }

    if (auction.status !== 'live') {
      throw new Error(`Auction is not currently live (Status: ${auction.status}).`);
    }

    const availableAttempts = this.userAttemptsMap[auctionId] ?? 0;
    if (availableAttempts <= 0) {
      throw new Error(
        'ATTEMPTS_EXHAUSTED: You have 0 remaining bid attempts. Purchase a bid package to place bids.'
      );
    }

    if (submission.amountUnits <= 0) {
      throw new Error('Bid amount must be greater than 0.00 ETB.');
    }

    if (submission.amountUnits > auction.maxBidLimitUnits) {
      throw new Error(
        `Bid exceeds maximum allowed limit of ${(auction.maxBidLimitUnits / 100).toFixed(2)} ETB.`
      );
    }

    // Deduct 1 attempt
    const newRemainingAttempts = availableAttempts - 1;
    this.userAttemptsMap[auctionId] = newRemainingAttempts;
    auction.totalBidsCount += 1;

    // Determine status (mock heuristic)
    // Low values with odd subunits simulated as unique lowest or unique
    const isOdd = submission.amountUnits % 2 === 1;
    const isVeryLow = submission.amountUnits < 100; // < 1.00 ETB
    const status = isVeryLow && isOdd ? 'unique_lowest' : isVeryLow ? 'unique_not_lowest' : 'submitted';

    const newBid: UserBid = {
      id: `bid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      auctionId,
      auctionTitle: auction.title,
      amountUnits: submission.amountUnits,
      placedAt: this.getCurrentServerTime(),
      status,
      idempotencyKey: submission.idempotencyKey,
    };

    this.userBids.unshift(newBid);

    // Create privacy-safe anonymized event for the public live feed
    // NEVER reveal exact bid amount or user identity!
    const cities = ['Addis Ababa', 'Hawassa', 'Bahir Dar', 'Adama', 'Dire Dawa', 'Mekelle'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const feedEvent: LiveFeedEvent = {
      id: `evt_${Date.now()}`,
      type: 'bid_placed',
      auctionId: auction.id,
      auctionTitle: auction.title,
      timestamp: this.getCurrentServerTime(),
      displayMessage: `A new bid was placed on ${auction.title}`,
      city: randomCity,
    };
    this.liveEvents.unshift(feedEvent);
    if (this.liveEvents.length > 50) {
      this.liveEvents.pop();
    }

    const response: BidSubmissionResponse = {
      success: true,
      bidId: newBid.id,
      auctionId,
      amountUnits: submission.amountUnits,
      placedAt: newBid.placedAt,
      remainingAttempts: newRemainingAttempts,
      status: newBid.status,
      message:
        status === 'unique_lowest'
          ? 'Bid Placed! Your bid is currently the Lowest Unique Bid!'
          : 'Bid successfully registered!',
    };

    this.processedIdempotencyKeys.set(submission.idempotencyKey, response);
    return response;
  }

  async getLiveEvents(): Promise<LiveFeedEvent[]> {
    await this.delay(100);
    return [...this.liveEvents];
  }

  async getResults(): Promise<AuctionResult[]> {
    await this.delay(150);
    return [...this.results];
  }

  async getResultById(auctionId: string): Promise<AuctionResult> {
    await this.delay(150);
    const res = this.results.find((r) => r.auctionId === auctionId);
    if (!res) {
      throw new Error(`Auction result for "${auctionId}" not found.`);
    }
    return res;
  }

  async getMyBids(auctionId?: string): Promise<UserBid[]> {
    await this.delay(200);
    if (auctionId) {
      return this.userBids.filter((b) => b.auctionId === auctionId);
    }
    return [...this.userBids];
  }

  async getUserProfile(): Promise<UserProfile> {
    await this.delay(100);
    return {
      ...this.userProfile,
      activeBidsCount: this.userBids.length,
    };
  }

  async updateUserProfile(payload: {
    fullName: string;
    email?: string;
    city?: string;
    phone?: string;
  }): Promise<UserProfile> {
    await this.delay(250);
    if (!payload.fullName || payload.fullName.trim().length < 2) {
      throw new Error('Full name must be at least 2 characters.');
    }
    this.userProfile.fullName = payload.fullName.trim();
    if (payload.email !== undefined) this.userProfile.email = payload.email.trim();
    if (payload.city !== undefined) this.userProfile.city = payload.city.trim();
    if (payload.phone !== undefined) this.userProfile.phone = payload.phone.trim();
    return {
      ...this.userProfile,
      activeBidsCount: this.userBids.length,
    };
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    await this.delay(350);
    if (!payload.currentPassword) {
      throw new Error('Please enter your current password.');
    }
    if (!payload.newPassword || payload.newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }
    if (payload.newPassword !== payload.confirmPassword) {
      throw new Error('New password and confirmation do not match.');
    }
    return {
      success: true,
      message: 'Password successfully updated!',
    };
  }

  async updatePreferences(
    prefs: Partial<UserProfile['preferences']>
  ): Promise<UserProfile['preferences']> {
    await this.delay(150);
    this.userProfile.preferences = {
      ...this.userProfile.preferences,
      ...prefs,
    };
    return this.userProfile.preferences;
  }

  async depositFunds(
    amountUnits: number,
    provider: string
  ): Promise<{ success: boolean; newBalance: number }> {
    await this.delay(350);
    if (amountUnits <= 0) {
      throw new Error('Deposit amount must be greater than 0.');
    }
    this.userProfile.walletBalanceUnits += amountUnits;
    return {
      success: true,
      newBalance: this.userProfile.walletBalanceUnits,
    };
  }

  async getNotifications(): Promise<UserNotification[]> {
    await this.delay(100);
    return [
      {
        id: 'notif_1',
        title: 'Status Update: iPhone 16 Pro Max',
        message: 'Your bid of 0.60 ETB is currently the lowest unique bid!',
        type: 'bid_update',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        read: false,
        link: '/my-bids',
      },
      {
        id: 'notif_2',
        title: 'Auction Ending Soon',
        message: 'iPhone 16 Pro Max closes in less than 45 minutes.',
        type: 'auction_alert',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        read: false,
        link: '/auctions/auc_iphone16',
      },
      {
        id: 'notif_3',
        title: 'Prize Dispatched',
        message: '50,000 ETB Shopping Voucher has been sent to your registered phone number.',
        type: 'reward',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        link: '/results',
      },
    ];
  }
}

// Global mock singleton for client runtime
export const mockStore = new MockStore();

