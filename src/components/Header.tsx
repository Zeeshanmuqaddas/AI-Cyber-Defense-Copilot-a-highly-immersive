import React from 'react';
import { FileWarning, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentState } from '../hooks/useSimulation';

export function Header({ threatLevel }: { threatLevel: number }) {
  return (
    <header className="absolute top-0 w-full p-6 flex justify-between items-center pointer-events-none z-50">
      <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full pointer-events-auto">
        <Shield className="w-5 h-5 text-[#00f0ff]" />
        <div>
          <h1 className="font-sans font-bold text-lg leading-tight tracking-wide text-white">AI CYBER DEFENSE</h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#00f0ff] uppercase opacity-80">Autonomous SOC Copilot</p>
        </div>
      </div>

      <div className={cn(
        "glass-panel px-6 py-2 rounded-full flex items-center gap-4 pointer-events-auto transition-colors",
        threatLevel > 75 ? "border-[#ff003c]/50 bg-[#ff003c]/10" : ""
      )}>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">System Status</span>
          <span className={cn(
            "text-sm font-bold tracking-widest",
            threatLevel > 75 ? "text-[#ff003c] text-glow-red" : "text-[#00ff66]"
          )}>
            {threatLevel > 75 ? 'DEFCON 2' : 'SECURE'}
          </span>
        </div>
        {threatLevel > 75 ? (
          <ShieldAlert className="w-8 h-8 text-[#ff003c] animate-pulse" />
        ) : (
          <ShieldCheck className="w-8 h-8 text-[#00ff66]" />
        )}
      </div>
    </header>
  );
}
