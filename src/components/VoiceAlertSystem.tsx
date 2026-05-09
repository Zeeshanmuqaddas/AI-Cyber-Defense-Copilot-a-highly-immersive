import { useEffect, useRef } from 'react';
import { LogEntry } from '../hooks/useSimulation';

export function useVoiceAlert(threatLevel: number, logs: LogEntry[]) {
  const lastAlertTime = useRef(0);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!speechSynthRef.current) return;

    const now = Date.now();
    // Only alert at most every 15 seconds to avoid spam
    if (now - lastAlertTime.current < 15000) return;

    // Check recent critical logs
    const recentLogs = logs.slice(0, 3);
    const criticalLog = recentLogs.find(l => l.level === 'CRITICAL');

    if (threatLevel > 85) {
      speak("Warning. Critical threat level detected. AI recommends immediate isolation.");
      lastAlertTime.current = now;
    } else if (criticalLog && now - criticalLog.timestamp.getTime() < 3000) {
      if (criticalLog.message.includes("Malware")) {
         speak("Warning. Malware activity detected in sector 4.");
      } else if (criticalLog.message.includes("DDoS")) {
         speak("Warning. DDoS signature identified. Mitigation active.");
      } else {
         speak("Critical network anomaly detected.");
      }
      lastAlertTime.current = now;
    }

  }, [threatLevel, logs]);

  const speak = (text: string) => {
    if (speechSynthRef.current) {
        // Try to cancel current speech
        speechSynthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a robotic/sci-fi voice
        const voices = speechSynthRef.current.getVoices();
        const preferredVoice = voices.find(v => 
          v.name.includes("Google UK English Male") || 
          v.name.includes("Samantha") ||
          v.name.includes("Siri")
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.1; // Slightly faster
        utterance.pitch = 0.9; // Slightly deeper
        speechSynthRef.current.speak(utterance);
    }
  };
}

export function VoiceAlertSystem({ threatLevel, logs }: { threatLevel: number, logs: LogEntry[] }) {
  useVoiceAlert(threatLevel, logs);
  return null; // Invisible component
}
