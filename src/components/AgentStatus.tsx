import React from 'react';
import { AgentState } from '../hooks/useSimulation';
import { Activity, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function AgentStatusPanel({ agents }: { agents: AgentState[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 h-full overflow-y-auto">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-black/40 border border-white/5 rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-sm font-semibold tracking-wide text-white/90">{agent.name}</span>
            {agent.status === 'ANALYZING' && <Activity className="w-4 h-4 text-[#00f0ff] animate-pulse" />}
            {agent.status === 'RESOLVING' && <ShieldAlert className="w-4 h-4 text-[#ff003c] animate-bounce" />}
            {agent.status === 'IDLE' && <ShieldCheck className="w-4 h-4 text-[#00ff66]" />}
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Status</span>
              <span className={cn(
                "text-xs font-mono font-bold uppercase",
                agent.status === 'ANALYZING' ? "text-[#00f0ff] text-glow-cyan" :
                agent.status === 'RESOLVING' ? "text-[#ff003c] text-glow-red" :
                "text-[#00ff66]"
              )}>
                {agent.status}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Conf</span>
              <span className="text-sm font-mono text-white/90">{agent.confidence}%</span>
            </div>
          </div>

          <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
            <motion.div 
              className={cn(
                "h-full rounded-full",
                agent.status === 'ANALYZING' ? "bg-[#00f0ff]" :
                agent.status === 'RESOLVING' ? "bg-[#ff003c]" :
                "bg-[#00ff66]"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${agent.confidence}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
