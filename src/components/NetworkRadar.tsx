import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Radar, Target } from 'lucide-react';

interface ThreatNode {
  id: string;
  x: number;
  y: number;
  severity: 'low' | 'high';
}

export function NetworkRadar() {
  const [nodes, setNodes] = useState<ThreatNode[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add nodes
      if (Math.random() > 0.4) {
        setNodes(prev => [
          ...prev, 
          {
            id: Math.random().toString(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            severity: (Math.random() > 0.8 ? 'high' : 'low') as 'high' | 'low'
          }
        ].slice(-8)); // keep max 8
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
      <div className="relative w-[800px] h-[800px] rounded-full border border-white/5 bg-black/20 cyber-grid opacity-30 flex items-center justify-center">
        {/* Radar concentric circles */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-white/10"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#00f0ff]/20"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full border border-[#00f0ff]/40"></div>
        <div className="absolute w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_20px_#00f0ff]"></div>
        
        {/* Radar Sweeper */}
        <div 
          className="absolute w-[400px] h-[400px] origin-bottom-right bottom-1/2 right-1/2 bg-gradient-to-t from-transparent to-[#00f0ff]/20"
          style={{ 
             borderRight: '2px solid rgba(0, 240, 255, 0.8)',
             animation: 'radar-scan 4s linear infinite'
          }}
        ></div>

        {/* Threat Nodes */}
        <AnimatePresence>
          {nodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute flex items-center justify-center"
              style={{ top: `${node.y}%`, left: `${node.x}%` }}
            >
              <div className={cn(
                "w-4 h-4 rounded-full relative flex items-center justify-center",
                node.severity === 'high' ? "bg-[#ff003c]" : "bg-[#cf00ff]"
              )}>
                <div className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-75",
                  node.severity === 'high' ? "bg-[#ff003c]" : "bg-[#cf00ff]"
                )}></div>
                {node.severity === 'high' && <Target className="w-6 h-6 text-white absolute" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Global Attack Lines - Static visual representation */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%">
              <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#ff003c" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="70%" y2="20%" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
        </div>
      </div>
    </div>
  );
}
