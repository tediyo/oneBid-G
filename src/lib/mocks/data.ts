import {
  Auction,
  AttemptPackage,
  UserBid,
  AuctionResult,
  LiveFeedEvent,
  UserProfile,
} from '@/lib/types/auction';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_mock_001',
  fullName: 'Abebe Kebede',
  phone: '+251 91 123 4567',
  email: 'abebe.kebede@ethionet.et',
  city: 'Addis Ababa (Bole)',
  nationalIdVerified: true,
  nationalIdNumber: 'ET-FAYDA-9482-1084',
  preferredPaymentMethod: 'telebirr',
  walletBalanceUnits: 250000, // 2,500.00 ETB
  activeBidsCount: 12,
  unreadNotificationsCount: 3,
  preferences: {
    smsOnOutbid: true,
    telegramAlerts: true,
    emailDropDigest: false,
    soundEffects: true,
  },
};

export const MOCK_ATTEMPT_PACKAGES: AttemptPackage[] = [
  {
    id: 'pkg_starter',
    name: 'Starter Pack',
    bidsCount: 5,
    bonusBidsCount: 0,
    priceUnits: 5000, // 50.00 ETB (10 ETB / bid)
  },
  {
    id: 'pkg_popular',
    name: 'Popular Value',
    bidsCount: 20,
    bonusBidsCount: 3,
    priceUnits: 18000, // 180.00 ETB (~7.8 ETB / bid)
    popular: true,
  },
  {
    id: 'pkg_pro',
    name: 'Master Bidder',
    bidsCount: 50,
    bonusBidsCount: 10,
    priceUnits: 40000, // 400.00 ETB (~6.6 ETB / bid)
    bestValue: true,
  },
  {
    id: 'pkg_elite',
    name: 'Champion Syndicate',
    bidsCount: 100,
    bonusBidsCount: 30,
    priceUnits: 70000, // 700.00 ETB (~5.38 ETB / bid)
  },
];

export const INITIAL_ATTEMPT_PACKAGES = MOCK_ATTEMPT_PACKAGES;

const now = new Date();
const inMinutes = (mins: number) => new Date(now.getTime() + mins * 60 * 1000).toISOString();
const agoMinutes = (mins: number) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const agoDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'auc_cash_500k',
    title: '500,000 ETB Instant Cash Prize Drop',
    shortDescription: 'Liquid direct wire transfer via Telebirr or Commercial Bank of Ethiopia (CBE).',
    description:
      'The ultimate cash drop! Win half a million Ethiopian Birr transferred instantly to your verified bank or mobile wallet account. The lowest unmatched decimal bid takes home the entire cash pool.',
    category: 'cash',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621981386864-77a83626d7f8?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 50000000, // 500,000.00 ETB
    bidFeeUnits: 3500, // 35.00 ETB per bid attempt
    maxBidLimitUnits: 25000, // Max bid ceiling: 250.00 ETB
    minBidIncrementUnits: 1, // 0.01 ETB
    status: 'live',
    startsAt: agoDays(2),
    closesAt: inMinutes(34), // Ending soon for high urgency!
    serverTime: now.toISOString(),
    totalBidsCount: 2840,
    uniqueBidsRatioEstimate: 38,
    featured: true,
    terms: [
      'Lowest Unique Bid wins: the smallest decimal amount placed by exactly one participant.',
      'Instant payout: wired within 2 hours of verification to Telebirr or CBE.',
      'Must have verified 18+ Ethiopian National ID or Kebele registration.',
      'Strict 0.01 ETB subunit increments enforced.',
    ],
  },
  {
    id: 'auc_suzuki_dzire',
    title: '2025 Suzuki Dzire GLX Automatic (Brand New 0-KM)',
    shortDescription: 'Zero mileage, dual airbags, keyless push start, yellow plate customs cleared.',
    description:
      'Drive home a brand new Suzuki Dzire GLX! Premium sedan comfort, touchscreen infotainment with Apple CarPlay & Android Auto, and exceptional fuel economy for Addis Ababa driving.',
    category: 'cars',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 320000000, // 3,200,000.00 ETB
    bidFeeUnits: 10000, // 100.00 ETB per bid
    maxBidLimitUnits: 100000, // Max bid ceiling: 1,000.00 ETB
    minBidIncrementUnits: 1,
    status: 'live',
    startsAt: agoDays(4),
    closesAt: inDays(2),
    serverTime: now.toISOString(),
    totalBidsCount: 5120,
    featured: true,
    terms: [
      'Lowest Unique Bid wins: submit the smallest unmatched decimal amount.',
      'Title transfer paperwork and customs clearances facilitated by OneBid legal team in Addis Ababa.',
      'Winner pays only their exact winning bid value (e.g. 4.12 ETB) to claim ownership.',
      'Must be 18+ with valid driver’s license or legal national identity.',
    ],
  },
  {
    id: 'auc_iphone16',
    title: 'Apple iPhone 16 Pro Max (256GB - Desert Titanium)',
    shortDescription: 'Brand new, sealed with Apple warranty and local telecom registration.',
    description:
      'Experience Apple A18 Pro chip, 48MP Fusion camera system, Grade 5 titanium body, and full-day battery life. The winning bidder gets this sealed flagship smartphone for the lowest unmatched numeric bid!',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 24000000, // 240,000.00 ETB
    bidFeeUnits: 1500, // 15.00 ETB per bid
    maxBidLimitUnits: 50000, // Max bid ceiling: 500.00 ETB
    minBidIncrementUnits: 1, // 0.01 ETB
    status: 'live',
    startsAt: agoDays(2),
    closesAt: inMinutes(47), // Closes in 47 mins for exciting live countdown!
    serverTime: now.toISOString(),
    totalBidsCount: 1482,
    uniqueBidsRatioEstimate: 42,
    featured: true,
    terms: [
      'Lowest Unique Bid wins: submit the smallest decimal amount nobody else placed.',
      'Exact 0.01 ETB increments strictly enforced.',
      'Must have verified national ID / phone number for delivery.',
      'Unclaimed prizes after 14 days subject to rerun policy.',
    ],
  },
  {
    id: 'auc_macbook_m3',
    title: 'MacBook Air 15" M3 Chip (16GB RAM / 512GB SSD)',
    shortDescription: 'Ultra-thin powerhouse with Liquid Retina display & MagSafe charging.',
    description:
      'Supercharged by M3, providing up to 18 hours of battery life and support for up to two external displays. Perfect for software engineers, designers, and remote professionals in Ethiopia.',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 29500000, // 295,000.00 ETB
    bidFeeUnits: 2000, // 20.00 ETB
    maxBidLimitUnits: 100000, // 1,000.00 ETB
    minBidIncrementUnits: 1,
    status: 'live',
    startsAt: agoDays(1),
    closesAt: inDays(1), // Closes in 24 hours
    serverTime: now.toISOString(),
    totalBidsCount: 890,
    featured: true,
    terms: [
      'Lowest Unique Bid rule applies.',
      'All bids final once submitted.',
      'Delivered free of charge within Addis Ababa or sent via certified post nationally.',
    ],
  },
  {
    id: 'auc_pulsar_ns200',
    title: 'Bajaj Pulsar NS200 ABS Motorcycle (2025 Model)',
    shortDescription: 'Zero mileage, dual-channel ABS, liquid-cooled 199.5cc engine.',
    description:
      'Own the streets with exhilarating throttle response, aggressive streetfighter styling, and unmatched fuel economy. Complete with customs clearance, yellow plate registration, and helmet package.',
    category: 'cars',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 65000000, // 650,000.00 ETB
    bidFeeUnits: 5000, // 50.00 ETB
    maxBidLimitUnits: 250000, // 2,500.00 ETB
    minBidIncrementUnits: 1,
    status: 'live',
    startsAt: agoDays(3),
    closesAt: inDays(3),
    serverTime: now.toISOString(),
    totalBidsCount: 3410,
    terms: [
      'Winner must be of legal riding age with driver’s license.',
      'Title transfer paperwork facilitated by OneBid legal team.',
    ],
  },
  {
    id: 'auc_ps5_slim',
    title: 'Sony PlayStation 5 Slim + Extra DualSense & EA FC 25',
    shortDescription: '1TB SSD disc edition bundle with high-speed HDMI 2.1 cable.',
    description:
      'Next-generation gaming with haptic feedback, 4K 120Hz gameplay, and ultra-fast loading speeds.',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 12000000, // 120,000.00 ETB
    bidFeeUnits: 1000, // 10.00 ETB
    maxBidLimitUnits: 30000, // 300.00 ETB
    minBidIncrementUnits: 1,
    status: 'calculating',
    startsAt: agoDays(4),
    closesAt: agoMinutes(5), // Just closed, calculating!
    serverTime: now.toISOString(),
    totalBidsCount: 2210,
    terms: ['Result calculation in progress using verifiable algorithm.'],
  },
  {
    id: 'auc_samsung_tv',
    title: 'Samsung 65" QLED 4K Smart TV (Q70D Series)',
    shortDescription: 'Quantum Processor 4K, 120Hz native refresh rate, AirSlim design.',
    description:
      'Immerse yourself in over a billion shades of color powered by Quantum Dot technology. Ideal for movies, sports, and modern console gaming.',
    category: 'appliances',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 17500000, // 175,000.00 ETB
    bidFeeUnits: 1500, // 15.00 ETB
    maxBidLimitUnits: 40000, // 400.00 ETB
    minBidIncrementUnits: 1,
    status: 'scheduled',
    startsAt: inDays(1),
    closesAt: inDays(4),
    serverTime: now.toISOString(),
    totalBidsCount: 0,
    terms: ['Bidding unlocks promptly at the scheduled start date.'],
  },
  {
    id: 'auc_voucher_50k',
    title: '50,000 ETB Shopping Voucher (Supermarket & Malls)',
    shortDescription: 'Redeemable at Safeway, Friendship Mall, and Bambis Addis Ababa.',
    description:
      'Instant digital voucher valid for 1 full calendar year on groceries, clothing, and electronics.',
    category: 'vouchers',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    ],
    retailPriceUnits: 5000000, // 50,000.00 ETB
    bidFeeUnits: 500, // 5.00 ETB
    maxBidLimitUnits: 15000, // 150.00 ETB
    minBidIncrementUnits: 1,
    status: 'result_published',
    startsAt: agoDays(10),
    closesAt: agoDays(2),
    serverTime: now.toISOString(),
    totalBidsCount: 940,
    terms: ['Digital voucher code issued to the verified winner.'],
  },
];

export const INITIAL_USER_BIDS: UserBid[] = [
  {
    id: 'bid_usr_001',
    auctionId: 'auc_iphone16',
    auctionTitle: 'Apple iPhone 16 Pro Max (256GB - Desert Titanium)',
    amountUnits: 60, // 0.60 ETB
    placedAt: agoMinutes(15),
    status: 'unique_lowest',
    idempotencyKey: 'idem_mock_111',
  },
  {
    id: 'bid_usr_002',
    auctionId: 'auc_iphone16',
    auctionTitle: 'Apple iPhone 16 Pro Max (256GB - Desert Titanium)',
    amountUnits: 125, // 1.25 ETB
    placedAt: agoMinutes(35),
    status: 'duplicate',
    idempotencyKey: 'idem_mock_112',
  },
  {
    id: 'bid_usr_003',
    auctionId: 'auc_iphone16',
    auctionTitle: 'Apple iPhone 16 Pro Max (256GB - Desert Titanium)',
    amountUnits: 340, // 3.40 ETB
    placedAt: agoMinutes(60),
    status: 'outbid',
    idempotencyKey: 'idem_mock_113',
  },
  {
    id: 'bid_usr_004',
    auctionId: 'auc_macbook_m3',
    auctionTitle: 'MacBook Air 15" M3 Chip (16GB RAM / 512GB SSD)',
    amountUnits: 450, // 4.50 ETB
    placedAt: agoDays(1),
    status: 'unique_not_lowest',
    idempotencyKey: 'idem_mock_114',
  },
  {
    id: 'bid_usr_005',
    auctionId: 'auc_voucher_50k',
    auctionTitle: '50,000 ETB Shopping Voucher (Supermarket & Malls)',
    amountUnits: 32, // 0.32 ETB
    placedAt: agoDays(3),
    status: 'won',
    idempotencyKey: 'idem_mock_115',
  },
];

export const INITIAL_RESULTS: AuctionResult[] = [
  {
    auctionId: 'auc_suzuki_dzire',
    auctionTitle: '2024 Suzuki Dzire GLX (Brand New 0-KM)',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    retailPriceUnits: 280000000, // 2,800,000 ETB
    winningAmountUnits: 412, // 4.12 ETB!
    winnerDisplayName: 'Dawit G***',
    winnerCity: 'Addis Ababa (Bole)',
    totalParticipants: 1240,
    totalBidsPlaced: 4890,
    hasWinner: true,
    status: 'result_published',
    publishedAt: agoDays(1),
  },
  {
    auctionId: 'auc_cash_250k',
    auctionTitle: '250,000 ETB Instant Cash Prize Drop',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1200&q=80',
    retailPriceUnits: 25000000, // 250,000 ETB
    winningAmountUnits: 89, // 0.89 ETB!
    winnerDisplayName: 'Tigist M***',
    winnerCity: 'Hawassa',
    totalParticipants: 890,
    totalBidsPlaced: 2940,
    hasWinner: true,
    status: 'result_published',
    publishedAt: agoDays(3),
  },
  {
    auctionId: 'auc_voucher_50k',
    auctionTitle: '50,000 ETB Shopping Voucher (Supermarket & Malls)',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    retailPriceUnits: 5000000,
    winningAmountUnits: 32, // 0.32 ETB!
    winnerDisplayName: 'Abebe K***',
    winnerCity: 'Addis Ababa',
    totalParticipants: 312,
    totalBidsPlaced: 940,
    hasWinner: true,
    status: 'result_published',
    publishedAt: agoDays(5),
  },
  {
    auctionId: 'auc_ipad_pro',
    auctionTitle: 'Apple iPad Pro 13" M4 (OLED, 256GB WiFi)',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80',
    retailPriceUnits: 18500000,
    winningAmountUnits: null, // No unique bid found!
    winnerDisplayName: null,
    winnerCity: null,
    totalParticipants: 180,
    totalBidsPlaced: 530,
    hasWinner: false,
    status: 'rerun_scheduled',
    publishedAt: agoDays(6),
    rerunDate: inDays(2),
    rerunNote: 'No Single Unique Bid Found: Every submitted amount had duplicates. Auction scheduled for re-run!',
  },
];

export const INITIAL_LIVE_EVENTS: LiveFeedEvent[] = [
  {
    id: 'evt_001',
    type: 'bid_placed',
    auctionId: 'auc_iphone16',
    auctionTitle: 'iPhone 16 Pro Max',
    timestamp: agoMinutes(1),
    displayMessage: 'A new bid was placed on iPhone 16 Pro Max',
    city: 'Addis Ababa',
  },
  {
    id: 'evt_002',
    type: 'bid_placed',
    auctionId: 'auc_macbook_m3',
    auctionTitle: 'MacBook Air 15" M3',
    timestamp: agoMinutes(3),
    displayMessage: 'A new bid was placed on MacBook Air 15" M3',
    city: 'Adama',
  },
  {
    id: 'evt_003',
    type: 'closing_soon',
    auctionId: 'auc_iphone16',
    auctionTitle: 'iPhone 16 Pro Max',
    timestamp: agoMinutes(5),
    displayMessage: 'Auction for iPhone 16 Pro Max enters final closing hour!',
  },
  {
    id: 'evt_004',
    type: 'bid_placed',
    auctionId: 'auc_pulsar_ns200',
    auctionTitle: 'Bajaj Pulsar NS200',
    timestamp: agoMinutes(7),
    displayMessage: 'A new bid was placed on Bajaj Pulsar NS200',
    city: 'Bahir Dar',
  },
  {
    id: 'evt_005',
    type: 'bid_placed',
    auctionId: 'auc_iphone16',
    auctionTitle: 'iPhone 16 Pro Max',
    timestamp: agoMinutes(12),
    displayMessage: 'A new bid was placed on iPhone 16 Pro Max',
    city: 'Hawassa',
  },
];
