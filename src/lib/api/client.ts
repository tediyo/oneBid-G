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
import { mockStore } from '@/lib/mocks/handlers';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.minibid.et/v1';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const errorJson = await res.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // use default fallback
      }
      throw new Error(errorMessage);
    }

    return res.json();
  }

  // --- Auctions ---
  async getAuctions(params?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ auctions: Auction[]; serverTime: string }> {
    if (USE_MOCK) {
      return mockStore.getAuctions(params);
    }
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    return this.request<{ auctions: Auction[]; serverTime: string }>(
      `/auctions?${query.toString()}`
    );
  }

  async getAuctionById(id: string): Promise<Auction> {
    if (USE_MOCK) {
      return mockStore.getAuctionById(id);
    }
    return this.request<Auction>(`/auctions/${id}`);
  }

  // --- Packages ---
  async getAuctionPackages(auctionId: string): Promise<{
    packages: AttemptPackage[];
    availableAttempts: number;
  }> {
    if (USE_MOCK) {
      return mockStore.getAuctionPackages(auctionId);
    }
    return this.request<{ packages: AttemptPackage[]; availableAttempts: number }>(
      `/auctions/${auctionId}/packages`
    );
  }

  async purchasePackage(
    auctionId: string,
    packageId: string
  ): Promise<{ success: boolean; newBalance: number; addedAttempts: number }> {
    if (USE_MOCK) {
      return mockStore.purchasePackage(auctionId, packageId);
    }
    return this.request<{ success: boolean; newBalance: number; addedAttempts: number }>(
      `/auctions/${auctionId}/packages/${packageId}/purchase`,
      { method: 'POST' }
    );
  }

  // --- Bids ---
  async submitBid(
    auctionId: string,
    submission: BidSubmission
  ): Promise<BidSubmissionResponse> {
    if (USE_MOCK) {
      return mockStore.submitBid(auctionId, submission);
    }
    return this.request<BidSubmissionResponse>(`/auctions/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Idempotency-Key': submission.idempotencyKey,
      },
      body: JSON.stringify(submission),
    });
  }

  async getMyBids(auctionId?: string): Promise<UserBid[]> {
    if (USE_MOCK) {
      return mockStore.getMyBids(auctionId);
    }
    const query = auctionId ? `?auctionId=${auctionId}` : '';
    return this.request<UserBid[]>(`/me/bids${query}`);
  }

  // --- Live Events ---
  async getLiveEvents(): Promise<LiveFeedEvent[]> {
    if (USE_MOCK) {
      return mockStore.getLiveEvents();
    }
    return this.request<LiveFeedEvent[]>('/live/events');
  }

  // --- Results ---
  async getResults(): Promise<AuctionResult[]> {
    if (USE_MOCK) {
      return mockStore.getResults();
    }
    return this.request<AuctionResult[]>('/results');
  }

  async getResultById(auctionId: string): Promise<AuctionResult> {
    if (USE_MOCK) {
      return mockStore.getResultById(auctionId);
    }
    return this.request<AuctionResult>(`/results/${auctionId}`);
  }

  // --- Profile & Notifications ---
  async getUserProfile(): Promise<UserProfile> {
    if (USE_MOCK) {
      return mockStore.getUserProfile();
    }
    return this.request<UserProfile>('/me/profile');
  }

  async updateUserProfile(payload: {
    fullName: string;
    email?: string;
    city?: string;
    phone?: string;
  }): Promise<UserProfile> {
    if (USE_MOCK) {
      return mockStore.updateUserProfile(payload);
    }
    return this.request<UserProfile>('/me/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK) {
      return mockStore.changePassword(payload);
    }
    return this.request<{ success: boolean; message: string }>('/me/password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updatePreferences(
    prefs: Partial<UserProfile['preferences']>
  ): Promise<UserProfile['preferences']> {
    if (USE_MOCK) {
      return mockStore.updatePreferences(prefs);
    }
    return this.request<UserProfile['preferences']>('/me/preferences', {
      method: 'PATCH',
      body: JSON.stringify(prefs),
    });
  }

  async depositFunds(
    amountUnits: number,
    provider: string
  ): Promise<{ success: boolean; newBalance: number }> {
    if (USE_MOCK) {
      return mockStore.depositFunds(amountUnits, provider);
    }
    return this.request<{ success: boolean; newBalance: number }>('/me/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amountUnits, provider }),
    });
  }

  async getNotifications(): Promise<UserNotification[]> {
    if (USE_MOCK) {
      return mockStore.getNotifications();
    }
    return this.request<UserNotification[]>('/notifications');
  }
}

export const apiClient = new ApiClient();
export { USE_MOCK };

