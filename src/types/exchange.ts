/**
 * FINSTOCKCOIN - Type Definitions
 */

export type FiatCurrency = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyRate {
  code: FiatCurrency;
  symbol: string;
  rateToUSD: number; // 1 USD = X Currency
}

export type TradingMode = 'simple' | 'pro';

export type MainNavTab =
  | 'home'
  | 'overview'
  | 'markets'
  | 'spot'
  | 'futures'
  | 'options'
  | 'earn'
  | 'web3'
  | 'wallet'
  | 'history'
  | 'stocks'
  | 'commodities'
  | 'account'
  | 'security'
  | 'support'
  | 'other-markets'
  | 'fun'
  | 'fees'
  | 'api'
  | 'admin';

export interface TransactionRecord {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'CONVERT' | 'STAKE' | 'REWARD';
  asset: string;
  amount: number;
  price?: number;
  totalValue: number;
  quoteCurrency: string;
  fee: number;
  tdsDeduction?: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'FAILED';
  timestamp: number;
  txHash?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'DEPOSIT' | 'WITHDRAWAL' | 'KYC' | 'TRADING' | 'TAX_TDS' | 'SECURITY';
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: number;
  lastReply: string;
}

export interface SpotPair {
  id: string;
  symbol: string; // e.g. "BTC/USDT"
  baseAsset: string; // "BTC"
  quoteAsset: string; // "USDT" or "INR"
  category: 'crypto' | 'inr' | 'equities' | 'commodities';
  lastPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
  pricePrecision: number;
  amountPrecision: number;
  isHot?: boolean;
  isGainer?: boolean;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

export interface SpotOrder {
  id: string;
  pairId: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop_limit' | 'oco';
  price: number;
  amount: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled' | 'partially_filled';
  timestamp: number;
  fee: number;
  tdsDeduction?: number;
}

export interface FuturesContract {
  id: string;
  symbol: string; // "BTC-USDT-PERP"
  baseAsset: string;
  quoteAsset: string;
  markPrice: number;
  indexPrice: number;
  fundingRate: number;
  nextFundingInSeconds: number;
  maxLeverage: number;
  volume24h: number;
  change24h: number;
}

export interface FuturesPosition {
  id: string;
  contractId: string;
  symbol: string;
  side: 'long' | 'short';
  leverage: number;
  marginType: 'cross' | 'isolated';
  entryPrice: number;
  markPrice: number;
  size: number; // in contract base units
  margin: number;
  liquidationPrice: number;
  unrealizedPnL: number;
  roePercent: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface OptionItem {
  id: string;
  underlying: string; // "BTC"
  expiryDate: string; // "2026-11-26"
  strikePrice: number;
  optionType: 'call' | 'put';
  bid: number;
  ask: number;
  lastPrice: number;
  iv: number; // Implied Volatility %
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  openInterest: number;
}

export interface EarnPool {
  id: string;
  asset: string;
  name: string;
  type: 'flexible' | 'locked';
  apyPercent: number;
  durationDays?: number;
  minDeposit: number;
  totalStaked: number;
  userStaked: number;
  earnedRewards: number;
  isHot?: boolean;
}

export interface WalletAssetBalance {
  asset: string;
  name: string;
  total: number;
  available: number;
  locked: number;
  usdValue: number;
  iconColor: string;
  type: 'crypto' | 'fiat';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  accountType: 'Savings' | 'Current';
  isVerified: boolean;
  pennyDropStatus: 'verified' | 'pending';
}

export interface NomineeDetails {
  id: string;
  fullName: string;
  relationship: string;
  panNumber: string;
  dateOfBirth: string;
  allocationPercent: number;
}

export interface KYCData {
  status: 'verified' | 'pending' | 'unverified';
  country: string;
  idType: 'PAN_AADHAAR' | 'PASSPORT' | 'DRIVING_LICENSE';
  panNumber?: string;
  aadhaarNumber?: string;
  digilockerVerified: boolean;
  fiuCompliant: boolean;
  verifiedAt?: string;
}

export interface AdminStats {
  totalAUM: number;
  volume24h: number;
  activeUsers: number;
  reserveRatioPercent: number;
  circuitBreakerActive: boolean;
  pendingKycCount: number;
  pendingWithdrawalsCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: number;
  ipAddress: string;
  status: 'success' | 'warning' | 'critical';
  hash: string;
}
