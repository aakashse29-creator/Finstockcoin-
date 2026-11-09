import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateIndianTDS,
  calculateTradeFee,
  calculateFuturesLiquidationPrice,
  calculateFuturesPnL,
  calculateBlackScholesGreeks,
  matchOrderAgainstBook,
  BookOrder
} from './exchangeMath';

test('calculateIndianTDS: 1% Section 194S deduction on crypto sale', () => {
  const result = calculateIndianTDS(0.5, 60000); // 0.5 BTC at $60,000 = $30,000
  assert.equal(result.grossValue, 30000);
  assert.equal(result.tdsDeduction, 300); // 1% of 30,000
  assert.equal(result.netReceivable, 29700);
  assert.equal(result.tdsRatePercent, 1);
});

test('calculateTradeFee: VIP tier discounts & FST token 25% discount', () => {
  // VIP 0: Maker 0.08%, Taker 0.10%
  const takerNormal = calculateTradeFee(1, 10000, false, 0, false);
  assert.equal(takerNormal.feeAmount, 10); // 0.1% of 10000
  assert.equal(takerNormal.savings, 0);

  // VIP 0 with FST 25% discount
  const takerFST = calculateTradeFee(1, 10000, false, 0, true);
  assert.equal(takerFST.feeAmount, 7.5); // 0.075% of 10000
  assert.equal(takerFST.savings, 2.5);
});

test('calculateFuturesLiquidationPrice: Long and Short liquidation thresholds', () => {
  // Long 10x leverage from 50,000 entry with 0.5% MMR
  // Liq = 50,000 * (1 - 0.10 + 0.005) = 50,000 * 0.905 = 45,250
  const longLiq = calculateFuturesLiquidationPrice(50000, 10, 'long', 0.005);
  assert.equal(longLiq, 45250);

  // Short 10x leverage from 50,000 entry with 0.5% MMR
  // Liq = 50,000 * (1 + 0.10 - 0.005) = 50,000 * 1.095 = 54,750
  const shortLiq = calculateFuturesLiquidationPrice(50000, 10, 'short', 0.005);
  assert.equal(shortLiq, 54750);
});

test('calculateFuturesPnL: ROE and Margin calculations', () => {
  // Long position: 2 BTC at 60,000 with 20x leverage. Current price: 63,000
  // Value = 120,000. Margin = 6,000. Price gain = +3,000 * 2 = 6,000 PnL
  // ROE = 6,000 / 6,000 = +100%
  const result = calculateFuturesPnL(60000, 63000, 2, 20, 'long');
  assert.equal(result.pnl, 6000);
  assert.equal(result.roePercent, 100);
  assert.equal(result.marginRequired, 6000);
});

test('calculateBlackScholesGreeks: Call/Put prices and Greeks values', () => {
  const greeks = calculateBlackScholesGreeks(100, 100, 30 / 365, 0.05, 0.5);
  assert.ok(greeks.callPrice > 0, 'Call price should be positive');
  assert.ok(greeks.putPrice > 0, 'Put price should be positive');
  assert.ok(greeks.callDelta > 0 && greeks.callDelta < 1, 'Call delta should be between 0 and 1');
  assert.ok(greeks.putDelta < 0 && greeks.putDelta > -1, 'Put delta should be between -1 and 0');
  assert.ok(greeks.gamma > 0, 'Gamma should be positive');
  assert.ok(greeks.vega > 0, 'Vega should be positive');
});

test('matchOrderAgainstBook: executes market buy order against orderbook asks', () => {
  const book: BookOrder[] = [
    { id: '1', price: 100, amount: 2, side: 'sell', timestamp: 1 },
    { id: '2', price: 102, amount: 3, side: 'sell', timestamp: 2 },
  ];

  // Market buy of 3 units: should consume 2 units at 100 and 1 unit at 102
  const match = matchOrderAgainstBook('buy', 3, 'market', null, book);
  assert.equal(match.filledAmount, 3);
  assert.equal(match.remainingAmount, 0);
  assert.equal(match.trades.length, 2);
  // Avg price: (2 * 100 + 1 * 102) / 3 = 302 / 3 = 100.67
  assert.equal(match.averagePrice, 100.67);
  // Remaining in book: order 2 with 2 units left at 102
  assert.equal(match.updatedBook.length, 1);
  assert.equal(match.updatedBook[0].amount, 2);
});
