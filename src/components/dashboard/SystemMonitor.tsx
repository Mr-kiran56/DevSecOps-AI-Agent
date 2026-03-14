import { useState, useEffect } from 'react';
import { MOCK_STATS } from '@/data/mockData';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import StatusBadge from '@/components/shared/StatusBadge';

const VulnBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[11px] w-28 shrink-0" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${(value / max) * 100}%`,
          background: color,
          animation: 'bar-grow 1.2s ease-out',
          '--bar-width': `${(value / max) * 100}%`,
        } as React.CSSProperties}
      />
    </div>
    <span className="text-[11px] font-mono w-8 text-right" style={{ color: 'var(--text-secondary)' }}>{value}</span>
  </div>
);

const CircularProgress = ({ value, color, size = 64 }: { value: number; color: string; size?: number }) => {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-card)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
};

const SystemMonitor = () => {
  const [cpu, setCpu] = useState(32);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(28 + Math.random() * 17);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const s = MOCK_STATS;
  const maxVuln = Math.max(...Object.values(s.breakdown));

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4" style={{ background: 'var(--bg-panel)' }}>
      <h2 className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
        System Monitor
      </h2>

      {/* Vuln Breakdown */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Security Brain</span>
          <AnimatedCounter target={s.totalVulns} className="text-lg font-mono font-bold text-cyber-cyan" />
        </div>
        <div className="space-y-2">
          <VulnBar label="SQL Injection" value={s.breakdown.sqlInjection} max={maxVuln} color="var(--accent-red)" />
          <VulnBar label="Cmd Injection" value={s.breakdown.commandInjection} max={maxVuln} color="var(--accent-orange)" />
          <VulnBar label="Hardcoded Secrets" value={s.breakdown.hardcodedSecrets} max={maxVuln} color="var(--accent-yellow)" />
          <VulnBar label="XSS" value={s.breakdown.xss} max={maxVuln} color="var(--accent-purple)" />
          <VulnBar label="Path Traversal" value={s.breakdown.pathTraversal} max={maxVuln} color="var(--accent-cyan)" />
        </div>
      </div>

      {/* Vector Memory */}
      <div className="glass-card p-4">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Vector Memory Engine</span>
        <div className="mt-3 flex items-center gap-4">
          <CircularProgress value={s.semanticMatchRate} color="var(--accent-cyan)" />
          <div className="space-y-1">
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Embeddings: <AnimatedCounter target={s.vectorCount} className="font-mono text-cyber-cyan" /></div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Retrieval Hits: <AnimatedCounter target={s.memoryHits} className="font-mono text-foreground" /></div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Semantic Match: <AnimatedCounter target={s.semanticMatchRate} suffix="%" className="font-mono text-cyber-green" /></div>
          </div>
        </div>
      </div>

      {/* Patch Performance */}
      <div className="glass-card p-4">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Patch Performance</span>
        <div className="mt-3 flex items-center gap-4">
          <CircularProgress value={s.fixSuccessRate} color="var(--accent-green)" />
          <div className="space-y-1">
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Fix Rate: <AnimatedCounter target={s.fixSuccessRate} suffix="%" className="font-mono text-cyber-green" /></div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Avg Retries: <AnimatedCounter target={s.avgRetries} decimals={1} className="font-mono text-foreground" /></div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Verified: <AnimatedCounter target={s.verifiedFixes} className="font-mono text-foreground" /></div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Manual: <AnimatedCounter target={s.manualReviews} className="font-mono text-cyber-yellow" /></div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="glass-card p-4">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Agent Status</span>
        <div className="mt-3 space-y-2">
          {[
            { label: 'LLM Engine', status: 'ACTIVE' as const },
            { label: 'LangGraph Nodes', status: 'RUNNING' as const },
            { label: 'RAG Memory', status: 'ENABLED' as const },
            { label: 'Docker Sandbox', status: 'RUNNING' as const },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Docker Sandbox */}
      <div className="glass-card p-4">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>Docker Sandbox</span>
        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Container</span>
            <StatusBadge status="RUNNING" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: 'var(--text-dim)' }}>CPU</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{Math.round(cpu)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-cyber-cyan transition-all duration-[2s]" style={{ width: `${cpu}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span style={{ color: 'var(--text-dim)' }}>Memory</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>410MB / 512MB</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-cyber-purple" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ML Shield */}
      <div className="glass-card p-4">
        <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>ML Shield — Isolation Forest</span>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Runtime Behavior</span>
            <span className="text-sm font-mono font-bold text-cyber-green" style={{ textShadow: '0 0 12px rgba(0,255,136,0.3)' }}>NORMAL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Anomalies Detected</span>
            <span className="text-sm font-mono font-bold text-cyber-green">0</span>
          </div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>Last check: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
