import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Send, Cpu, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini SDK
// Note: In AI Studio preview, process.env.GEMINI_API_KEY is automatically populated.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'SOC Assistant online. Real-time reasoning pipeline active. How can I assist you with threat containment?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Create a prompt that includes the conversation history context
      const chatHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
      const fullPrompt = `You are a highly advanced AI Cybersecurity Operations Center (SOC) Defense Copilot. You speak concisely, analytically, and use cybersecurity terminology. Do not break character.\n\nConversation history:\n${chatHistory}\n\nUser: ${userMessage.content}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: fullPrompt,
        config: {
          systemInstruction: "You are an elite autonomous SOC Copilot. Maintain a professional, futuristic, and slightly intense persona. Use cyber-defense terminology. Format responses using Markdown (bolding, lists) when helpful.",
        }
      });

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || 'Process interrupted. No response generated.'
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: '> **ERROR**: Connection to reasoning pipeline failed. Key may be missing or invalid.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-lg border border-white/10 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex max-w-[85%]",
            msg.role === 'user' ? "ml-auto justify-end" : "mr-auto justify-start"
          )}>
            <div className={cn(
              "px-3 py-2 rounded-xl text-sm font-sans flex gap-2",
              msg.role === 'user' 
                ? "bg-white/10 border border-white/20 text-white rounded-br-none" 
                : "bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#e0ffff] rounded-bl-none"
            )}>
              {msg.role === 'model' && <Cpu className="w-4 h-4 mt-0.5 shrink-0 text-[#00f0ff]" />}
              <div className="markdown-body prose prose-invert prose-p:leading-snug prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="mr-auto flex px-3 py-2 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-xl rounded-bl-none">
            <Loader2 className="w-4 h-4 text-[#00f0ff] animate-spin" />
            <span className="ml-2 text-xs font-mono text-[#00f0ff]/70 uppercase tracking-widest mt-0.5">Reasoning Pipeline...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/50 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Issue command to AI Copilot..."
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm font-sans text-white focus:outline-none focus:border-[#00f0ff]/50 transition-colors placeholder:text-white/30"
          disabled={isTyping}
        />
        <button 
          type="submit"
          disabled={isTyping || !input.trim()}
          className="bg-[#00f0ff]/20 text-[#00f0ff] hover:bg-[#00f0ff]/30 p-2 rounded border border-[#00f0ff]/30 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
