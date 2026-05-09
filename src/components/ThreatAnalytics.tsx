import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function ThreatAnalytics({ threatLevel }: { threatLevel: number }) {
  // Generate some dummy historical data based on current threatLevel for the sparkline
  const data = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      time: i,
      value: Math.max(0, Math.min(100, threatLevel + (Math.sin(i) * 10) + (Math.random() * 20 - 10)))
    }));
  }, [threatLevel]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="text-[10px] text-white/50 uppercase tracking-widest font-mono mb-1">Global Threat Index</h4>
          <div className="text-4xl font-mono text-white flex items-baseline gap-1">
            <span className={threatLevel > 75 ? 'text-[#ff003c] text-glow-red' : threatLevel > 40 ? 'text-amber-400' : 'text-[#00f0ff] text-glow-cyan'}>
              {threatLevel.toFixed(1)}
            </span>
            <span className="text-sm text-white/40">/ 100</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/40 block">Network Traffic</span>
          <span className="text-sm text-white/80 font-mono">1.24 TB/s</span>
        </div>
      </div>

      <div className="flex-1 min-h-[100px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={threatLevel > 75 ? "#ff003c" : "#00f0ff"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={threatLevel > 75 ? "#ff003c" : "#00f0ff"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,255,255,0.2)', borderRadius: '4px' }}
              itemStyle={{ color: '#00f0ff', fontFamily: 'monospace' }}
              labelStyle={{ display: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={threatLevel > 75 ? "#ff003c" : "#00f0ff"} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
