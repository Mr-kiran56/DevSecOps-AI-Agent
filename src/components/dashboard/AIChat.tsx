import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import { MOCK_AI_RESPONSES } from '@/data/mockData';

const CHIPS = [
  { label: '🔍 Scan repo', keyword: 'scan' },
  { label: '📋 Analyze PR', keyword: 'analyze' },
  { label: '⚠ Show vulns', keyword: 'vuln' },
  { label: '🔧 Generate fix', keyword: 'fix' },
  { label: '🧠 Show memory', keyword: 'memory' },
];

const AIChat = () => {
  const { activeRepo, chatHistory, addChatMessage } = useRepo();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, typing]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    addChatMessage({ role: 'user', text: msg });
    setInput('');
    setTyping(true);

    const keyword = Object.keys(MOCK_AI_RESPONSES).find(k => msg.toLowerCase().includes(k));
    const response = MOCK_AI_RESPONSES[keyword || 'default'];

    setTimeout(() => {
      setTyping(false);
      addChatMessage({ role: 'ai', text: response });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-panel)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-dim)] flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{activeRepo?.name}</p>
          <p className="text-[11px] font-mono" style={{ color: 'var(--text-dim)' }}>AI Security Auditor</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green">GitHub ✓</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple">RAG ✓</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap ${
              msg.role === 'ai'
                ? 'bg-[var(--bg-card)] border-l-2 border-cyber-cyan'
                : 'bg-cyber-purple/15 border-r-2 border-cyber-purple'
            }`} style={{ color: 'var(--text-primary)' }}>
              {msg.role === 'ai' && (
                <span className="text-[10px] font-mono block mb-1" style={{ color: 'var(--accent-cyan)' }}>⬡ AI</span>
              )}
              {msg.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-[var(--bg-card)] border-l-2 border-cyber-cyan p-3 rounded-lg">
              <span className="text-[10px] font-mono block mb-1" style={{ color: 'var(--accent-cyan)' }}>⬡ AI</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-cyber-cyan inline-block"
                    style={{ animation: `typing-bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chips */}
      <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
        {CHIPS.map(chip => (
          <button
            key={chip.keyword}
            onClick={() => setInput(chip.label)}
            className="text-[10px] font-mono px-2 py-1 rounded glass-card hover:border-[var(--border-glow)] transition-all"
            style={{ color: 'var(--text-secondary)' }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-dim)]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${activeRepo?.name}...`}
            className="flex-1 px-3 py-2.5 rounded-lg text-sm font-mono bg-[var(--bg-card)] border border-[var(--border-dim)]
                       text-foreground placeholder:text-muted-foreground
                       focus:border-[var(--accent-cyan)] focus:shadow-[0_0_12px_rgba(0,212,255,0.2)] outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-lg text-sm font-bold
                       bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground
                       hover:shadow-[var(--glow-cyan)] transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
