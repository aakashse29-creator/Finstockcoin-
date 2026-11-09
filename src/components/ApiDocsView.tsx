import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle, Code, Radio } from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('ticker');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const endpoints = [
    { id: 'ticker', method: 'GET', path: '/api/v1/ticker/24hr?symbol=FSTUSDT', title: '24hr Ticker Price Change' },
    { id: 'depth', method: 'GET', path: '/api/v1/depth?symbol=BTCUSDT&limit=20', title: 'Order Book Depth' },
    { id: 'order', method: 'POST', path: '/api/v1/order (Signed HMAC-SHA256)', title: 'Create New Order' },
    { id: 'ws', method: 'WSS', path: 'wss://stream.finstockcoin.com/ws/fstusdt@depth', title: 'Real-time WebSocket Depth' },
  ];

  const codeSnippets: Record<string, string> = {
    ticker: `// Python Request
import requests

url = "https://api.finstockcoin.com/api/v1/ticker/24hr"
params = {"symbol": "FSTUSDT"}
response = requests.get(url, params=params)
print(response.json())`,
    depth: `// Node.js Request
const axios = require('axios');

async function getOrderBook() {
  const res = await axios.get('https://api.finstockcoin.com/api/v1/depth', {
    params: { symbol: 'BTCUSDT', limit: 20 }
  });
  console.log(res.data);
}
getOrderBook();`,
    order: `// Python Authenticated Request with HMAC-SHA256
import hmac, hashlib, time, requests

api_key = "FINSTOCK_PRO_KEY"
secret = "MY_SECRET_KEY".encode()
timestamp = int(time.time() * 1000)
query = f"symbol=FSTUSDT&side=BUY&type=LIMIT&quantity=100&price=8.40&timestamp={timestamp}"
signature = hmac.new(secret, query.encode(), hashlib.sha256).hexdigest()

headers = {"X-FINSTOCK-APIKEY": api_key}
res = requests.post(f"https://api.finstockcoin.com/api/v1/order?{query}&signature={signature}", headers=headers)
print(res.json())`,
    ws: `// WebSocket Subscription
const ws = new WebSocket('wss://stream.finstockcoin.com/ws/fstusdt@depth');

ws.onmessage = (event) => {
  const depthUpdate = JSON.parse(event.data);
  console.log("Real-time depth:", depthUpdate);
};`,
  };

  const handleTestCall = () => {
    if (selectedEndpoint === 'ticker') {
      setApiResponse(JSON.stringify({
        symbol: "FSTUSDT",
        priceChange: "+1.09",
        priceChangePercent: "+14.85",
        lastPrice: "8.4200",
        highPrice: "8.9500",
        lowPrice: "7.1500",
        volume: "48920150.00",
        quoteVolume: "411907663.00",
        closeTime: Date.now()
      }, null, 2));
    } else if (selectedEndpoint === 'depth') {
      setApiResponse(JSON.stringify({
        lastUpdateId: 981240182,
        bids: [["91450.00", "2.410"], ["91448.50", "4.120"], ["91446.00", "6.850"]],
        asks: [["91452.00", "1.890"], ["91454.00", "3.240"], ["91456.50", "5.100"]]
      }, null, 2));
    } else {
      setApiResponse(JSON.stringify({
        result: "SUCCESS",
        orderId: "ORD-98214-FS",
        clientOrderId: "client_991823",
        executedQty: "100.00",
        cummulativeQuoteQty: "840.00",
        orderStatus: "FILLED",
        tdsDeduction: "0.00"
      }, null, 2));
    }
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(codeSnippets[selectedEndpoint]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-6 max-w-[1400px] mx-auto w-full font-sans">
      <div className="bg-[#0f141f] border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>High-Frequency Trading &amp; Algo APIs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            FINSTOCK Public REST &amp; WebSocket API
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build quantitative algorithms, scalper bots, and institutional arbitrage engines with &lt;10ms execution latency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Endpoints List (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
            API Endpoints
          </span>
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              type="button"
              onClick={() => {
                setSelectedEndpoint(ep.id);
                setApiResponse(null);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                selectedEndpoint === ep.id
                  ? 'bg-blue-600/20 border-blue-500/50 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                  ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {ep.method}
                </span>
                <span className="font-bold text-xs text-white">{ep.title}</span>
              </div>
              <div className="text-[11px] font-mono-numbers text-slate-400 truncate">{ep.path}</div>
            </button>
          ))}
        </div>

        {/* Code & Live Test Panel (8 cols) */}
        <div className="lg:col-span-8 bg-[#0f141f] border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between font-mono-numbers text-xs">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                Integration Code Snippet
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="bg-[#0b0e14] border border-slate-800 rounded-xl p-4 text-slate-300 overflow-x-auto text-[11px] leading-relaxed mb-4">
              <code>{codeSnippets[selectedEndpoint]}</code>
            </pre>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-xs font-semibold">Live Sandbox Response</span>
              <button
                type="button"
                onClick={handleTestCall}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Send Request
              </button>
            </div>

            {apiResponse && (
              <pre className="bg-slate-950 border border-emerald-900/40 text-emerald-400 p-4 rounded-xl text-[11px] overflow-x-auto max-h-56">
                <code>{apiResponse}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
