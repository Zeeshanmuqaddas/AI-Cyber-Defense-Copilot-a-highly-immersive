import React from 'react';
import { LogEntry } from '../hooks/useSimulation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function LiveLogs({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="flex flex-col h-full font-mono text-xs overflow-y-auto pr-2 space-y-1">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={cn(
            "p-2 rounded border border-transparent flex gap-3 animate-in fade-in slide-in-from-left-2",
            log.level === 'CRITICAL' ? "bg-red-500/10 border-red-500/20 text-red-400" :
            log.level === 'WARN' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
            "text-white/70 hover:bg-white/5"
          )}
        >
          <span className="opacity-50 shrink-0">{format(log.timestamp, 'HH:mm:ss')}</span>
          <span className="shrink-0 w-16">{log.level}</span>
          <span className="opacity-70 shrink-0">[{log.source}]</span>
          <span className="truncate">{log.message}</span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="flex items-center justify-center h-full text-white/30 animate-pulse">
          Awaiting log streams...
        </div>
      )}
    </div>
  );
}
