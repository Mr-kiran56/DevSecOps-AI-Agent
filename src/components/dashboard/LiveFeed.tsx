import { useEffect, useRef } from 'react';
import { useRepo } from '@/context/RepoContext';
import { RANDOM_EVENTS } from '@/data/mockData';

const statusIcon: Record<string, { icon: string; color: string }> = {
  success: { icon: '✓', color: 'var(--accent-green)' },
  processing: { icon: '⟳', color: 'var(--accent-yellow)' },
  critical: { icon: '✕', color: 'var(--accent-red)' },
};

const LiveFeed = () => {
  const { feedEvents, addFeedEvent } = useRepo();
  const scrollRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      const text = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
        .replace('{count}', String(910 + counterRef.current));
      counterRef.current++;

      addFeedEvent({
        id: Date.now(),
        time,
        status: Math.random() > 0.1 ? 'success' : 'processing',
        text,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [addFeedEvent]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [feedEvents]);

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-panel)' }}>
      <div className="px-4 py-3 border-b border-[var(--border-dim)] flex items-center gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Live Security Feed</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse-dot" />
          <span className="text-[10px] font-mono text-cyber-red">LIVE</span>
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {feedEvents.map((event, i) => {
          const s = statusIcon[event.status] || statusIcon.success;
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 px-4 py-2.5 border-b border-[var(--border-dim)]
                         hover:bg-[var(--bg-card)] transition-colors group cursor-default
                         ${i === 0 ? 'animate-slide-in-top' : ''}`}
            >
              <span className="text-[10px] font-mono shrink-0 pt-0.5" style={{ color: 'var(--text-dim)' }}>
                {event.time}
              </span>
              <span className="text-sm shrink-0" style={{ color: s.color }}>
                {s.icon}
              </span>
              <span className="text-[12px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {event.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveFeed;
