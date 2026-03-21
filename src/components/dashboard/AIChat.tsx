import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import { MOCK_AI_RESPONSES } from '@/data/mockData';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const CHIPS = [
  { label: 'Scan repo', keyword: 'scan' },
  { label: 'Analyze PR', keyword: 'analyze' },
  { label: 'Show vulns', keyword: 'vuln' },
  { label: 'Generate fix', keyword: 'fix' },
  { label: 'Show memory', keyword: 'memory' },
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
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{activeRepo?.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Security Auditor</p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-status-success/10 text-status-success font-medium">Connected</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'ai' ? 'bg-primary/10' : 'bg-secondary'
            }`}>
              {msg.role === 'ai' ? (
                <Bot className="w-3.5 h-3.5 text-primary" />
              ) : (
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
              msg.role === 'ai'
                ? 'bg-card border border-border text-foreground'
                : 'bg-foreground text-background'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border px-4 py-3 rounded-2xl">
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Chips */}
      <div className="px-5 pb-2 flex gap-1.5 flex-wrap">
        {CHIPS.map(chip => (
          <button
            key={chip.keyword}
            onClick={() => setInput(chip.label)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground
                       hover:text-foreground hover:border-foreground/20 active:scale-[0.97] transition-all duration-200"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${activeRepo?.name}...`}
            className="flex-1 px-4 py-3 rounded-xl text-sm bg-background border border-border
                       text-foreground placeholder:text-muted-foreground
                       focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-200"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-3 rounded-xl bg-foreground text-background
                       hover:opacity-90 active:scale-[0.96] transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
