import { useState, useEffect } from 'react';

export type LogEntry = {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
  source: string;
};

export type AgentState = {
  id: string;
  name: string;
  status: 'IDLE' | 'ANALYZING' | 'RESOLVING' | 'OFFLINE';
  confidence: number;
};

const INITIAL_AGENTS: AgentState[] = [
  { id: '1', name: 'Threat Detect', status: 'ANALYZING', confidence: 94 },
  { id: '2', name: 'Incident Resp', status: 'IDLE', confidence: 99 },
  { id: '3', name: 'Network Mon', status: 'ANALYZING', confidence: 87 },
  { id: '4', name: 'Malware Lab', status: 'IDLE', confidence: 100 },
];

const RANDOM_LOGS = [
  "Incoming connection from Tor exit node.",
  "Unusual outbound traffic detected on port 443.",
  "Failed admin login attempt: Brute force signature match.",
  "DDoS mitigation engaged on primary edge server.",
  "Malware sample isolated in sandbox.",
  "Privilege escalation attempt blocked.",
  "Encrypted payload signature matched APT29.",
  "Data exfiltration attempt aborted by AI agent."
];

export function useSimulation() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [threatLevel, setThreatLevel] = useState<number>(42);

  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const isCritical = Math.random() > 0.8;
      const isWarn = Math.random() > 0.5;
      const level = isCritical ? 'CRITICAL' : isWarn ? 'WARN' : 'INFO';
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        level,
        message: RANDOM_LOGS[Math.floor(Math.random() * RANDOM_LOGS.length)],
        source: `NODE-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50));
      
      // Randomly fluctuate threat level
      setThreatLevel(prev => {
        let next = prev + (Math.random() * 10 - 5);
        if (isCritical) next += 15;
        return Math.max(0, Math.min(100, next));
      });

    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Simulate agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.6 ? 'ANALYZING' : Math.random() > 0.8 ? 'RESOLVING' : 'IDLE',
        confidence: Math.floor(Math.random() * 20) + 80
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { logs, agents, threatLevel };
}
