import React, { useState, useRef, useEffect } from 'react';
import { Gift, Award, Zap, Users, Copy, CheckCircle, Sparkles } from 'lucide-react';

interface FinstockFunViewProps {
  onRewardClaim: (rewardText: string, amountFst: number) => void;
}

export const FinstockFunView: React.FC<FinstockFunViewProps> = ({ onRewardClaim }) => {
  const [streakDays, setStreakDays] = useState<number>(4);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<number>(0);

  const prizes = [
    '50 FST',
    'VIP 1 Trial',
    '10 USDT',
    'Zero Fee Pass',
    '100 FST',
    '5 USDT',
    'Mystery Box',
    '25 FST',
  ];

  // Draw Lucky Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const radius = size / 2;
    const numSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rotationRef.current);

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'];

    for (let i = 0; i < numSlices; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 10, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      ctx.fillText(prizes[i], radius - 20, 4);
      ctx.restore();
    }

    // Center pin
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f141f';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.restore();
  }, [spinning]);

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    setHasCheckedInToday(true);
    setStreakDays((prev) => prev + 1);
    onRewardClaim('Daily Streak Check-in Day 5: +15 FST', 15);
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    const randomRotations = Math.PI * 2 * (5 + Math.random() * 4);
    const startRot = rotationRef.current;
    const targetRot = startRot + randomRotations;
    const duration = 3000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      rotationRef.current = startRot + (targetRot - startRot) * ease;

      // Redraw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const size = 260;
          const radius = size / 2;
          const numSlices = prizes.length;
          const sliceAngle = (2 * Math.PI) / numSlices;
          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6'];

          ctx.clearRect(0, 0, size, size);
          ctx.save();
          ctx.translate(radius, radius);
          ctx.rotate(rotationRef.current);

          for (let i = 0; i < numSlices; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius - 10, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();

            ctx.save();
            ctx.rotate(i * sliceAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
            ctx.fillText(prizes[i], radius - 20, 4);
            ctx.restore();
          }

          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, 2 * Math.PI);
          ctx.fillStyle = '#0f141f';
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          ctx.restore();
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const won = prizes[prizeIndex];
        setSpinResult(won);
        onRewardClaim(`Lucky Spin Prize: ${won}`, 25);
      }
    };

    requestAnimationFrame(animate);
  };

  const copyReferral = () => {
    navigator.clipboard?.writeText('https://finstockcoin.com/ref/TRADEPRO89');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      {/* Title */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-blue-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finstock Fun &amp; Community Rewards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Daily Streaks, Lucky Spins &amp; 40% Referral Rebates
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete daily missions, maintain your trading streak, and earn free FST tokens and VIP privileges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Daily Streak Check-in (6 cols) */}
        <div className="lg:col-span-6 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                7-Day Login Streak ({streakDays}/7 Days)
              </h3>
              <span className="text-xs font-bold text-amber-400 font-mono-numbers">
                Reward: 50 FST on Day 7
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 my-4">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isClaimed = day <= streakDays;
                return (
                  <div
                    key={day}
                    className={`rounded-xl p-2.5 text-center flex flex-col items-center justify-between transition-all ${
                      isClaimed
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">D{day}</span>
                    <Gift className={`w-4 h-4 my-1 ${isClaimed ? 'text-amber-400' : 'text-slate-600'}`} />
                    <span className="text-[10px] font-mono-numbers font-bold">+{day * 5} FST</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckIn}
            disabled={hasCheckedInToday}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              hasCheckedInToday
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-950/50'
            }`}
          >
            {hasCheckedInToday ? 'Checked in Today (Come back tomorrow!)' : 'Claim Daily Check-In Reward'}
          </button>
        </div>

        {/* Lucky Spin Wheel (6 cols) */}
        <div className="lg:col-span-6 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              Lucky Fortune Wheel
            </h3>
            <span className="text-xs text-slate-400">1 Free Spin Every 24h</span>
          </div>

          {/* Pointer and Canvas */}
          <div className="relative my-3 flex flex-col items-center">
            {/* Downward indicator triangle */}
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-amber-400 z-20 mb-[-8px]" />
            <canvas ref={canvasRef} className="rounded-full shadow-2xl" />
          </div>

          {spinResult && (
            <div className="mb-2 p-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>You won: {spinResult}! Credited to your wallet.</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSpinWheel}
            disabled={spinning}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
          >
            {spinning ? 'Spinning...' : 'Spin the Lucky Wheel'}
          </button>
        </div>
      </div>

      {/* Referral Hub */}
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-1">
            <Users className="w-4 h-4" />
            <span>VIP Referral Program</span>
          </div>
          <h3 className="text-lg font-bold text-white">Earn 40% Lifetime Trading Commission Rebate</h3>
          <p className="text-xs text-slate-400 mt-1">
            Invite friends to FINSTOCKCOIN. When they trade, you receive 40% of all generated fees instantly in USDT!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-numbers">
          <span className="text-slate-300">finstockcoin.com/ref/TRADEPRO89</span>
          <button
            type="button"
            onClick={copyReferral}
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
          >
            {copiedLink ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
