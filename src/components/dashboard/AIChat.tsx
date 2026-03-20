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
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{activeRepo?.name}</p>
          <p className="text-[11px] text-muted-foreground">Security Auditor</p>
        </div>
        <div className="flex gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-status-success/10 text-status-success">Connected</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
              msg.role === 'ai' ? 'bg-primary/10' : 'bg-secondary'
            }`}>
              {msg.role === 'ai' ? (
                <Bot className="w-3.5 h-3.5 text-primary" />
              ) : (
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap ${
              msg.role === 'ai'
                ? 'bg-card border border-border text-foreground'
                : 'bg-primary text-primary-foreground'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border px-3.5 py-3 rounded-lg">
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
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
            className="text-[11px] px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground
                       hover:text-foreground active:scale-[0.97] transition-all duration-150"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${activeRepo?.name}...`}
            className="flex-1 px-3.5 py-2.5 rounded-lg text-sm bg-secondary border border-border
                       text-foreground placeholder:text-muted-foreground
                       focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-150"
          />
          <button
            onClick={() => handleSend()}
            className="px-3.5 py-2.5 rounded-lg bg-primary text-primary-foreground
                       hover:brightness-110 active:scale-[0.96] transition-all duration-150"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
