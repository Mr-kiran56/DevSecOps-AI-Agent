import { useEffect, useRef } from 'react';
import { useRepo } from '@/context/RepoContext';
import { RANDOM_EVENTS } from '@/data/mockData';
import { CheckCircle2, Loader2, XCircle, Radio } from 'lucide-react';

const statusConfig: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-status-success' },
  processing: { icon: Loader2, className: 'text-status-warning' },
  critical: { icon: XCircle, className: 'text-status-error' },
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
    <div className="flex flex-col h-full bg-background">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">Live Feed</span>
        <div className="flex items-center gap-1.5 ml-auto">
          <Radio className="w-3 h-3 text-status-error animate-pulse-subtle" />
          <span className="text-[10px] font-mono text-status-error font-medium">LIVE</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {feedEvents.map((event, i) => {
          const config = statusConfig[event.status] || statusConfig.success;
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 px-5 py-3 border-b border-border
                         hover:bg-card transition-colors cursor-default
                         ${i === 0 ? 'animate-slide-in-top' : ''}`}
            >
              <span className="text-[10px] font-mono text-muted-foreground shrink-0 pt-0.5 tabular-nums">
                {event.time}
              </span>
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${config.className}`} />
              <span className="text-[12px] leading-snug text-secondary-foreground">
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
