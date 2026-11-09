/**
 * FINSTOCKCOIN - Core Exchange Financial & Trading Mathematics Engine
 * Supports standard double-entry precision, Black-Scholes Greeks,
 * Futures Margin & Liquidation, and Indian FIU-IND 1% TDS / 30% VDA Tax calculations.
 */

export interface FeeStructure {
  makerFeePercent: number;
  takerFeePercent: number;
  fstDiscountPercent: number; // e.g. 25% discount if paid with FST
}

export const VIP_FEE_TIERS: Record<number, FeeStructure> = {
  0: { makerFeePercent: 0.08, takerFeePercent: 0.10, fstDiscountPercent: 25 },
  1: { makerFeePercent: 0.07, takerFeePercent: 0.09, fstDiscountPercent: 25 },
  2: { makerFeePercent: 0.06, takerFeePercent: 0.08, fstDiscountPercent: 25 },
  3: { makerFeePercent: 0.05, takerFeePercent: 0.07, fstDiscountPercent: 25 },
  4: { makerFeePercent: 0.04, takerFeePercent: 0.06, fstDiscountPercent: 25 },
  5: { makerFeePercent: 0.03, takerFeePercent: 0.05, fstDiscountPercent: 25 },
};

/**
 * Calculates Section 194S TDS for Indian Virtual Digital Assets (VDA).
 * Applicable at 1% on the gross consideration of crypto-to-fiat, crypto-to-crypto, or transfer.
 */
export function calculateIndianTDS(amount: number, price: number, rate = 0.01): {
  grossValue: number;
  tdsDeduction: number;
  netReceivable: number;
  tdsRatePercent: number;
} {
  const grossValue = Number((amount * price).toFixed(4));
  const tdsDeduction = Number((grossValue * rate).toFixed(4));
  const netReceivable = Number((grossValue - tdsDeduction).toFixed(4));
  return {
    grossValue,
    tdsDeduction,
    netReceivable,
    tdsRatePercent: rate * 100,
  };
}

/**
 * Calculates trading fees with VIP tier and optional FST token discount.
 */
export function calculateTradeFee(
  amount: number,
  price: number,
  isMaker: boolean,
  vipTier = 0,
  payWithFST = false
): { feeAmount: number; effectiveRatePercent: number; savings: number } {
  const tier = VIP_FEE_TIERS[vipTier] || VIP_FEE_TIERS[0];
  const baseRate = isMaker ? tier.makerFeePercent : tier.takerFeePercent;
  const rateMultiplier = payWithFST ? (1 - tier.fstDiscountPercent / 100) : 1;
  const effectiveRate = baseRate * rateMultiplier;

  const totalValue = amount * price;
  const baseFee = (totalValue * baseRate) / 100;
  const finalFee = (totalValue * effectiveRate) / 100;
  const savings = baseFee - finalFee;

  return {
    feeAmount: Number(finalFee.toFixed(6)),
    effectiveRatePercent: Number(effectiveRate.toFixed(4)),
    savings: Number(savings.toFixed(6)),
  };
}

/**
 * Futures Perpetual Liquidation Price calculation.
 * For Long: Liq = Entry * (1 - (1/Leverage) + MMR)
 * For Short: Liq = Entry * (1 + (1/Leverage) - MMR)
 */
export function calculateFuturesLiquidationPrice(
  entryPrice: number,
  leverage: number,
  side: 'long' | 'short',
  maintenanceMarginRatio = 0.005 // 0.5% default MMR
): number {
  if (leverage <= 0 || entryPrice <= 0) return 0;
  const initialMarginRate = 1 / leverage;

  if (side === 'long') {
    const liqPrice = entryPrice * (1 - initialMarginRate + maintenanceMarginRatio);
    return Math.max(0, Number(liqPrice.toFixed(2)));
  } else {
    const liqPrice = entryPrice * (1 + initialMarginRate - maintenanceMarginRatio);
    return Number(liqPrice.toFixed(2));
  }
}

/**
 * Return on Equity (ROE %) and Unrealized PnL for Futures.
 */
export function calculateFuturesPnL(
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  leverage: number,
  side: 'long' | 'short'
): { pnl: number; roePercent: number; marginRequired: number } {
  const positionValue = entryPrice * quantity;
  const marginRequired = positionValue / leverage;
  const priceDiff = side === 'long' ? (currentPrice - entryPrice) : (entryPrice - currentPrice);
  const pnl = priceDiff * quantity;
  const roePercent = marginRequired > 0 ? (pnl / marginRequired) * 100 : 0;

  return {
    pnl: Number(pnl.toFixed(2)),
    roePercent: Number(roePercent.toFixed(2)),
    marginRequired: Number(marginRequired.toFixed(2)),
  };
}

/**
 * Cumulative Standard Normal Distribution Approximation (Abramowitz & Stegun)
 */
function normalCdf(x: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return (1.0 - c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
  } else {
    const t = 1.0 / (1.0 - p * x);
    return (c * Math.exp(-x * x / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
  }
}

/**
 * Standard Normal Probability Density Function
 */
function normalPdf(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Black-Scholes Options Pricing and Greeks (Delta, Gamma, Theta, Vega)
 */
export function calculateBlackScholesGreeks(
  spotPrice: number,
  strikePrice: number,
  timeToExpiryYears: number, // e.g. 7 days = 7/365
  riskFreeRate = 0.04, // 4%
  volatility = 0.65 // 65% annualized IV
): {
  callPrice: number;
  putPrice: number;
  callDelta: number;
  putDelta: number;
  gamma: number;
  theta: number;
  vega: number;
} {
  if (timeToExpiryYears <= 0 || volatility <= 0 || spotPrice <= 0 || strikePrice <= 0) {
    const intrinsicCall = Math.max(0, spotPrice - strikePrice);
    const intrinsicPut = Math.max(0, strikePrice - spotPrice);
    return {
      callPrice: Number(intrinsicCall.toFixed(2)),
      putPrice: Number(intrinsicPut.toFixed(2)),
      callDelta: spotPrice > strikePrice ? 1 : 0,
      putDelta: spotPrice < strikePrice ? -1 : 0,
      gamma: 0,
      theta: 0,
      vega: 0,
    };
  }

  const sqrtT = Math.sqrt(timeToExpiryYears);
  const d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate + (volatility * volatility) / 2) * timeToExpiryYears) / (volatility * sqrtT);
  const d2 = d1 - volatility * sqrtT;

  const Nd1 = normalCdf(d1);
  const Nd2 = normalCdf(d2);
  const N_minus_d1 = normalCdf(-d1);
  const N_minus_d2 = normalCdf(-d2);
  const pdf_d1 = normalPdf(d1);

  const discount = Math.exp(-riskFreeRate * timeToExpiryYears);

  const callPrice = spotPrice * Nd1 - strikePrice * discount * Nd2;
  const putPrice = strikePrice * discount * N_minus_d2 - spotPrice * N_minus_d1;

  const callDelta = Nd1;
  const putDelta = Nd1 - 1;
  const gamma = pdf_d1 / (spotPrice * volatility * sqrtT);
  // Theta per day
  const thetaAnnual = -(spotPrice * pdf_d1 * volatility) / (2 * sqrtT) - riskFreeRate * strikePrice * discount * Nd2;
  const theta = thetaAnnual / 365;
  // Vega per 1% change in vol
  const vega = (spotPrice * sqrtT * pdf_d1) / 100;

  return {
    callPrice: Math.max(0, Number(callPrice.toFixed(2))),
    putPrice: Math.max(0, Number(putPrice.toFixed(2))),
    callDelta: Number(callDelta.toFixed(3)),
    putDelta: Number(putDelta.toFixed(3)),
    gamma: Number(gamma.toFixed(5)),
    theta: Number(theta.toFixed(3)),
    vega: Number(vega.toFixed(3)),
  };
}

/**
 * Order Book Matcher - executes an incoming order against existing book
 */
export interface BookOrder {
  id: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface MatchResult {
  filledAmount: number;
  averagePrice: number;
  remainingAmount: number;
  trades: { price: number; amount: number; total: number; timestamp: number }[];
  updatedBook: BookOrder[];
}

export function matchOrderAgainstBook(
  incomingSide: 'buy' | 'sell',
  incomingAmount: number,
  orderType: 'market' | 'limit',
  limitPrice: number | null,
  book: BookOrder[]
): MatchResult {
  // If incoming is buy, match against asks (sorted ascending by price)
  // If incoming is sell, match against bids (sorted descending by price)
  const opposingOrders = [...book].sort((a, b) => {
    if (incomingSide === 'buy') {
      return a.price - b.price; // lowest ask first
    } else {
      return b.price - a.price; // highest bid first
    }
  });

  let remaining = incomingAmount;
  let totalCost = 0;
  let filledAmount = 0;
  const trades: { price: number; amount: number; total: number; timestamp: number }[] = [];
  const updatedBook: BookOrder[] = [];

  for (const resting of opposingOrders) {
    if (remaining <= 0) {
      updatedBook.push(resting);
      continue;
    }

    // Check limit price conditions
    if (orderType === 'limit' && limitPrice !== null) {
      if (incomingSide === 'buy' && resting.price > limitPrice) {
        updatedBook.push(resting);
        continue;
      }
      if (incomingSide === 'sell' && resting.price < limitPrice) {
        updatedBook.push(resting);
        continue;
      }
    }

    const fillThisRound = Math.min(remaining, resting.amount);
    remaining -= fillThisRound;
    filledAmount += fillThisRound;
    totalCost += fillThisRound * resting.price;

    trades.push({
      price: resting.price,
      amount: fillThisRound,
      total: fillThisRound * resting.price,
      timestamp: Date.now(),
    });

    if (resting.amount > fillThisRound) {
      updatedBook.push({
        ...resting,
        amount: Number((resting.amount - fillThisRound).toFixed(6)),
      });
    }
  }

  const averagePrice = filledAmount > 0 ? Number((totalCost / filledAmount).toFixed(2)) : 0;

  return {
    filledAmount: Number(filledAmount.toFixed(6)),
    averagePrice,
    remainingAmount: Number(remaining.toFixed(6)),
    trades,
    updatedBook,
  };
}
