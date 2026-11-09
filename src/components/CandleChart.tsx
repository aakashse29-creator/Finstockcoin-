import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Candle } from '../types/exchange';

interface CandleChartProps {
  candles: Candle[];
  symbol: string;
  lastPrice: number;
  currencySymbol?: string;
  onPriceSelect?: (price: number) => void;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  candles,
  symbol,
  lastPrice,
  currencySymbol = '$',
  onPriceSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; price: number } | null>(null);

  // Compute EMAs
  const ema20 = useMemo(() => {
    const k = 2 / (20 + 1);
    const result: number[] = [];
    let prevEma = candles[0]?.close || 0;
    for (let i = 0; i < candles.length; i++) {
      const ema = candles[i].close * k + prevEma * (1 - k);
      result.push(ema);
      prevEma = ema;
    }
    return result;
  }, [candles]);

  const ema50 = useMemo(() => {
    const k = 2 / (50 + 1);
    const result: number[] = [];
    let prevEma = candles[0]?.close || 0;
    for (let i = 0; i < candles.length; i++) {
      const ema = candles[i].close * k + prevEma * (1 - k);
      result.push(ema);
      prevEma = ema;
    }
    return result;
  }, [candles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 380;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Layout dimensions
    const priceScaleWidth = 65;
    const timeScaleHeight = 24;
    const chartWidth = width - priceScaleWidth;
    const chartHeight = height - timeScaleHeight;
    const volumeHeight = showVolume ? chartHeight * 0.22 : 0;
    const mainChartHeight = chartHeight - volumeHeight;

    // Clear background
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, width, height);

    // Compute min and max price
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const priceToY = (price: number) => {
      return mainChartHeight - ((price - minPrice) / priceRange) * mainChartHeight;
    };

    const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.7);
    const candleSpacing = chartWidth / candles.length;

    // Draw horizontal grid lines and price labels
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';

    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const price = minPrice + (priceRange / gridSteps) * i;
      const y = priceToY(price);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      ctx.fillText(price.toFixed(price > 1000 ? 0 : 2), chartWidth + 6, y + 3);
    }

    // Draw Volume Bars
    if (showVolume && maxVolume > 0) {
      candles.forEach((candle, i) => {
        const x = i * candleSpacing + candleSpacing / 2;
        const volRatio = candle.volume / maxVolume;
        const vBarHeight = volRatio * (volumeHeight - 5);
        const vBarY = chartHeight - vBarHeight;

        ctx.fillStyle = candle.close >= candle.open ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(x - candleWidth / 2, vBarY, candleWidth, vBarHeight);
      });
    }

    // Draw Candlesticks
    candles.forEach((candle, i) => {
      const x = i * candleSpacing + candleSpacing / 2;
      const isUp = candle.close >= candle.open;
      const color = isUp ? '#10b981' : '#ef4444';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.2;

      // Wick
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const bodyY = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(closeY - openY));

      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
    });

    // Draw EMA 20 & EMA 50
    if (showEMA) {
      // EMA 20 (Amber)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candles.forEach((_, i) => {
        const x = i * candleSpacing + candleSpacing / 2;
        const y = priceToY(ema20[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // EMA 50 (Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candles.forEach((_, i) => {
        const x = i * candleSpacing + candleSpacing / 2;
        const y = priceToY(ema50[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Draw Last Price dotted line
    const lastPriceY = priceToY(lastPrice);
    if (lastPriceY >= 0 && lastPriceY <= chartHeight) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(0, lastPriceY);
      ctx.lineTo(chartWidth, lastPriceY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge on right
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(chartWidth + 2, lastPriceY - 9, priceScaleWidth - 4, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText(lastPrice.toFixed(lastPrice > 1000 ? 0 : 2), chartWidth + 6, lastPriceY + 3);
    }

    // Crosshair rendering
    if (crosshair && crosshair.x < chartWidth && crosshair.y < chartHeight) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.setLineDash([2, 2]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, 0);
      ctx.lineTo(crosshair.x, chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crosshair.y);
      ctx.lineTo(chartWidth, crosshair.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair price tag
      ctx.fillStyle = '#475569';
      ctx.fillRect(chartWidth + 2, crosshair.y - 8, priceScaleWidth - 4, 16);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(crosshair.price.toFixed(crosshair.price > 1000 ? 0 : 2), chartWidth + 6, crosshair.y + 3);
    }
  }, [candles, lastPrice, showEMA, showVolume, crosshair, ema20, ema50]);

  // Handle Mouse Move on Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const priceScaleWidth = 65;
    const chartWidth = rect.width - priceScaleWidth;
    const chartHeight = rect.height - 24;

    if (x > chartWidth || y > chartHeight) {
      setCrosshair(null);
      setHoveredCandle(null);
      return;
    }

    // Find closest candle
    const candleSpacing = chartWidth / candles.length;
    const index = Math.min(candles.length - 1, Math.max(0, Math.floor(x / candleSpacing)));
    const candle = candles[index];

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    const pricePadding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const calculatedPrice = maxPrice - (y / chartHeight) * priceRange;

    setCrosshair({ x, y, price: calculatedPrice });
    setHoveredCandle(candle);
  };

  const handleMouseLeave = () => {
    setCrosshair(null);
    setHoveredCandle(null);
  };

  const handleClick = () => {
    if (crosshair && onPriceSelect) {
      onPriceSelect(Number(crosshair.price.toFixed(2)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0e14] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
      {/* Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-slate-800 bg-[#0f141f] text-xs">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-slate-300 mr-2">{symbol}</span>
          {['1m', '5m', '15m', '1h', '4h', '1D'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={showEMA}
              onChange={(e) => setShowEMA(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
            />
            <span className="text-[11px]">EMA (20/50)</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={(e) => setShowVolume(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
            />
            <span className="text-[11px]">Volume</span>
          </label>
        </div>
      </div>

      {/* Hover Information Ribbon */}
      <div className="px-3 py-1 bg-[#0b0e14] border-b border-slate-800/60 flex flex-wrap items-center gap-4 text-[11px] font-mono-numbers text-slate-400">
        {hoveredCandle ? (
          <>
            <span>Time: <span className="text-slate-200">{new Date(hoveredCandle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
            <span>O: <span className="text-slate-200">{hoveredCandle.open.toFixed(2)}</span></span>
            <span>H: <span className="text-emerald-400">{hoveredCandle.high.toFixed(2)}</span></span>
            <span>L: <span className="text-rose-400">{hoveredCandle.low.toFixed(2)}</span></span>
            <span>C: <span className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{hoveredCandle.close.toFixed(2)}</span></span>
            <span>Vol: <span className="text-slate-200">{hoveredCandle.volume}</span></span>
          </>
        ) : (
          <span className="text-slate-500 italic">Hover over chart for OHLCV data • Click chart to load price</span>
        )}
      </div>

      {/* Canvas container */}
      <div ref={containerRef} className="relative flex-1 min-h-[300px] w-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
