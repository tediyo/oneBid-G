# OneBid Ethiopia — Lowest Unique Bid Platform (Cash, Cars & Tech)

A modern, production-grade Next.js (App Router) web application built for the **Lowest Unique Bid Auction** model inspired by **OneBid Ethiopia (`onebid.et`)**.

---

## OneBid Product & UX Specifications

### 1. Core Model: Lowest Unique Bid Wins
- **Flagship Categories**:
  - **💰 Cash Drops**: e.g., 500,000 ETB & 250,000 ETB instant cash drops via Telebirr or CBE.
  - **🚗 Cars & Motors**: e.g., Brand new 2025 Suzuki Dzire GLX Automatic (0-KM, yellow plate customs cleared).
  - **📱 Tech & Gadgets**: e.g., Sealed Apple iPhone 16 Pro Max, MacBook Air M3, PlayStation 5 Slim.
  - **🏠 Appliances & Vouchers**: e.g., Samsung 65" QLED TV, 50,000 ETB Shopping Vouchers.
- **The OneBid Settlement Rule**:
  - The winning bid is the **smallest numeric amount placed by exactly one participant**.
  - **The winner pays only their final winning bid amount** to take home the prize (e.g. winner of a 2,800,000 ETB Suzuki Dzire pays only **4.12 ETB**!).
  - Entry bid fees are flat and non-refundable (e.g. 15, 35, or 100 ETB per bid attempt).

### 2. Strict Integer Subunit Handling
- 1 unit = 0.01 ETB (e.g. `0.60 ETB` = `60 subunits`, `150.00 ETB` = `15,000 subunits`).
- Floating point math is strictly forbidden in calculations and state.

### 3. Navigation Architecture (Exact 5 Tabs)
- Bottom Navigation Bar (exact order):
  1. **Home** (`/`)
  2. **Auctions** (`/auctions`)
  3. **Live** (`/live`)
  4. **Results** (`/results`)
  5. **Rewards** (`/rewards`)
- **Header**: OneBid Wordmark, Search, Notifications with unread badge, and Profile Avatar with wallet balance.
- **My Bids**: Private secret ledger on `/my-bids` accessed via Home shortcut card and Profile drawer.
- **Profile & Settings**: Full account settings on `/profile` (Name edit, password change, Fayda/Kebele KYC, alerts, payment gateways).

### 4. Fairness, Legality & Trust
- **18+ Only**: Ethiopian national identity / Kebele verification.
- **Mathematical Fairness**: Pure strategic game theory, not a random lottery or lucky draw.
- **Instant Ethiopian Payouts**: Integrated support for Telebirr and Commercial Bank of Ethiopia (CBE).

---

## Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS + Glassmorphism UI
- **Icons**: Lucide React
- **State Management & Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **Validation**: Zod
- **Mock & Contract-First API**: `src/lib/api/client.ts` with mock router in `src/lib/mocks/handlers.ts`

---

## Directory Structure
```
mini-bid/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── layout.tsx              # Core Shell (Header + Content + BottomNav)
│   │   │   ├── page.tsx                # Home (Featured drop, ticker, my-bids card, grid)
│   │   │   ├── auctions/
│   │   │   │   ├── page.tsx            # Catalog (Search, status tabs, category filter)
│   │   │   │   └── [id]/page.tsx       # Details (Rules, attempts, buy bundle, bid modal)
│   │   │   ├── live/
│   │   │   │   └── page.tsx            # Safe real-time anonymized activity feed
│   │   │   ├── results/
│   │   │   │   ├── page.tsx            # Concluded auctions list
│   │   │   │   └── [id]/page.tsx       # Result detail (Winning bid / Rerun scheduled)
│   │   │   ├── my-bids/
│   │   │   │   └── page.tsx            # Private encrypted bid ledger
│   │   │   ├── profile/
│   │   │   │   └── page.tsx            # Profile Settings (Name, Password, KYC, Alerts, Wallet)
│   │   │   └── rewards/
│   │   │       └── page.tsx            # 5th Tab (Daily streak, lucky mystery spin, referrals)
│   │   ├── globals.css
│   │   └── layout.tsx                  # Root HTML shell + TanStack Query Provider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx              # Top Header (Wordmark, Search, Notifications, Profile)
│   │   │   └── bottom-nav.tsx          # 5-Tab mobile navigation bar
│   │   ├── providers/
│   │   │   └── query-provider.tsx      # TanStack QueryClient setup
│   │   └── ui/
│   │       ├── activity-ticker.tsx     # Privacy-compliant live activity ticker
│   │       ├── auction-card.tsx        # Reusable responsive auction card
│   │       ├── countdown-badge.tsx     # Server-authoritative countdown timer
│   │       ├── my-bids-card.tsx        # Home prominent shortcut card for user bids
│   │       ├── skeletons.tsx           # Complete loading skeletons
│   │       └── status-badge.tsx        # Auction & personal bid status pills
│   └── lib/
│       ├── api/
│       │   └── client.ts               # Centralized API client with mock toggle
│       ├── hooks/
│       │   └── use-countdown.ts        # Clock-synced countdown hook
│       ├── mocks/
│       │   ├── data.ts                 # Realistic initial mock datasets
│       │   └── handlers.ts             # In-memory session store & edge error simulator
│       ├── types/
│       │   └── auction.ts              # Contract-first TypeScript domain definitions
│       ├── utils/
│       │   ├── cn.ts                   # ClassNames merger
│       │   ├── currency.ts             # Strict ETB integer subunit helpers
│       │   └── time.ts                 # Time calculation and offset utilities
│       └── validations/
│           └── bid.ts                  # Zod validation schema for bid amounts
├── .env.local                          # Environment config (NEXT_PUBLIC_USE_MOCK=true)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Switching Between Mock & Live API

Set the environment variable in `.env.local` or deployment platform:

```env
# Set to 'false' to route calls to the live backend server
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=https://api.minibid.et/v1
```

When `NEXT_PUBLIC_USE_MOCK=true` (default), all API interactions are handled by the built-in mock session store, supporting:
- Bid placement with idempotency key deduplication
- Automatic decrement of user attempts balance
- Dynamic emission of privacy-safe live activity events
- Attempt exhaustion edge cases
- Package purchases with immediate wallet balance updates

