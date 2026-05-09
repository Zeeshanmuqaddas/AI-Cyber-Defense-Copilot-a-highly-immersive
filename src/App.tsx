import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { NetworkRadar } from './components/NetworkRadar';
import { DraggablePanel } from './components/DraggablePanel';
import { LiveLogs } from './components/LiveLogs';
import { AgentStatusPanel } from './components/AgentStatus';
import { ThreatAnalytics } from './components/ThreatAnalytics';
import { AIChatbot } from './components/AIChatbot';
import { useSimulation } from './hooks/useSimulation';
import { VoiceAlertSystem } from './components/VoiceAlertSystem';

export default function App() {
  const { logs, agents, threatLevel } = useSimulation();

  return (
    <div className="relative w-full h-screen bg-[#030514] text-white overflow-hidden font-sans select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f0ff]/5 via-[#030514]/80 to-[#030514] z-0"></div>
      
      <NetworkRadar />
      <Header threatLevel={threatLevel} />
      <VoiceAlertSystem threatLevel={threatLevel} logs={logs} />

      <main className="relative z-10 w-full h-full p-6 pt-24 pointer-events-none">
        
        {/* We use pointer-events-none on main to let users click drag panels, 
            then restore pointer-events-auto on the panels themselves inside DraggablePanel */}

        <DraggablePanel 
          title="Multi-Agent Network" 
          initialPos={{ x: 20, y: 0 }}
          className="w-[350px] h-[300px] pointer-events-auto"
        >
          <AgentStatusPanel agents={agents} />
        </DraggablePanel>

        <DraggablePanel 
          title="Live Threat Index" 
          initialPos={{ x: 400, y: 0 }}
          className="w-[450px] h-[220px] pointer-events-auto"
        >
          <ThreatAnalytics threatLevel={threatLevel} />
        </DraggablePanel>

        <DraggablePanel 
          title="Command Override / Co-pilot" 
          initialPos={{ x: window.innerWidth - 450, y: 0 }}
          className="w-[400px] h-[500px] pointer-events-auto"
        >
          <AIChatbot />
        </DraggablePanel>

        <DraggablePanel 
          title="Security Event Stream" 
          initialPos={{ x: 20, y: window.innerHeight - 300 - 80 }}
          className="w-[500px] h-[280px] pointer-events-auto"
        >
          <LiveLogs logs={logs} />
        </DraggablePanel>

      </main>
    </div>
  );
}
