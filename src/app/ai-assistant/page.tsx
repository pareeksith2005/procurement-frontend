"use client";
import React, { useState, useRef, useEffect } from 'react';
import { API } from '@/lib/api';

interface ChatMsg { role: 'user' | 'ai'; text: string; }

const SUGGESTIONS = [
  'Show me inventory summary',
  'What items are low stock?',
  'Who are the top suppliers?',
  'Show pending orders',
  "What's the total spending?",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'ai', text: "👋 Hello! I'm your **AI Procurement Assistant**. Ask me about inventory, suppliers, orders, or costs!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (msg: string) => {
    if (!msg.trim() || loading) return;
    const userMsg: ChatMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || 'Sorry, I could not process that.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Could not connect to AI backend. Make sure the backend is running.' }]);
    } finally { setLoading(false); }
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#081B3A]">AI Procurement Assistant</h1>
        <p className="text-gray-500 text-sm mt-1">Powered by real-time procurement data</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#081B3A] to-[#2563EB] px-5 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
          <div>
            <p className="text-white font-semibold text-sm">AI Procurement Assistant</p>
            <p className="text-blue-200 text-xs">Online • Powered by real data</p>
          </div>
          <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2563EB] text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-5 pb-3">
            <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} className="text-xs bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 px-3 py-1.5 rounded-full font-medium transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 p-4 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask about inventory, suppliers, orders..." disabled={loading}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] disabled:bg-gray-50" />
          <button onClick={() => send(input)} disabled={loading || !input.trim()}
            className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}
