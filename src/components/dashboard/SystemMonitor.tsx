import { useState, useEffect } from 'react';
import { MOCK_STATS } from '@/data/mockData';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import StatusBadge from '@/components/shared/StatusBadge';

const VulnBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-[11px] w-28 shrink-0 text-muted-foreground">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
    <span className="text-[11px] font-mono w-8 text-right text-muted-foreground tabular-nums">{value}</span>
  </div>
);

const CircularProgress = ({ value, color, size = 56 }: { value: number; color: string; size?: number }) => {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(35 15% 90%)" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold text-foreground">{value}</span>
    </div>
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
    <div className="h-full overflow-y-auto p-5 space-y-4 bg-background">
      <h2 className="text-sm font-semibold text-foreground">System Monitor</h2>

      {/* Vuln Breakdown */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-muted-foreground">Security Analysis</span>
          <AnimatedCounter target={s.totalVulns} className="text-lg font-mono font-semibold text-foreground" />
        </div>
        <div className="space-y-2.5">
          <VulnBar label="SQL Injection" value={s.breakdown.sqlInjection} max={maxVuln} color="hsl(0 65% 52%)" />
          <VulnBar label="Cmd Injection" value={s.breakdown.commandInjection} max={maxVuln} color="hsl(24 75% 48%)" />
          <VulnBar label="Hardcoded Secrets" value={s.breakdown.hardcodedSecrets} max={maxVuln} color="hsl(36 80% 50%)" />
          <VulnBar label="XSS" value={s.breakdown.xss} max={maxVuln} color="hsl(215 65% 50%)" />
          <VulnBar label="Path Traversal" value={s.breakdown.pathTraversal} max={maxVuln} color="hsl(152 56% 38%)" />
        </div>
      </div>

      {/* Vector Memory */}
      <div className="bg-card border border-border rounded-xl p-5">
        <span className="text-xs font-medium text-muted-foreground">Vector Memory</span>
        <div className="mt-4 flex items-center gap-4">
          <CircularProgress value={s.semanticMatchRate} color="hsl(215 65% 50%)" />
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div>Embeddings: <AnimatedCounter target={s.vectorCount} className="font-mono text-foreground font-medium" /></div>
            <div>Retrieval Hits: <AnimatedCounter target={s.memoryHits} className="font-mono text-foreground font-medium" /></div>
            <div>Match Rate: <AnimatedCounter target={s.semanticMatchRate} suffix="%" className="font-mono text-status-success font-medium" /></div>
          </div>
        </div>
      </div>

      {/* Patch Performance */}
      <div className="bg-card border border-border rounded-xl p-5">
        <span className="text-xs font-medium text-muted-foreground">Patch Performance</span>
        <div className="mt-4 flex items-center gap-4">
          <CircularProgress value={s.fixSuccessRate} color="hsl(152 56% 38%)" />
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div>Fix Rate: <AnimatedCounter target={s.fixSuccessRate} suffix="%" className="font-mono text-status-success font-medium" /></div>
            <div>Avg Retries: <AnimatedCounter target={s.avgRetries} decimals={1} className="font-mono text-foreground font-medium" /></div>
            <div>Verified: <AnimatedCounter target={s.verifiedFixes} className="font-mono text-foreground font-medium" /></div>
            <div>Manual: <AnimatedCounter target={s.manualReviews} className="font-mono text-status-warning font-medium" /></div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-card border border-border rounded-xl p-5">
        <span className="text-xs font-medium text-muted-foreground">Agent Status</span>
        <div className="mt-4 space-y-2.5">
          {[
            { label: 'LLM Engine', status: 'ACTIVE' as const },
            { label: 'LangGraph Nodes', status: 'RUNNING' as const },
            { label: 'RAG Memory', status: 'ENABLED' as const },
            { label: 'Docker Sandbox', status: 'RUNNING' as const },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{row.label}</span>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Docker Sandbox */}
      <div className="bg-card border border-border rounded-xl p-5">
        <span className="text-xs font-medium text-muted-foreground">Sandbox</span>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Container</span>
            <StatusBadge status="RUNNING" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-mono text-muted-foreground tabular-nums">{Math.round(cpu)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-[2s]" style={{ width: `${cpu}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-muted-foreground">Memory</span>
              <span className="font-mono text-muted-foreground tabular-nums">410 / 512 MB</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-status-info" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ML Shield */}
      <div className="bg-card border border-border rounded-xl p-5">
        <span className="text-xs font-medium text-muted-foreground">ML Shield</span>
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Runtime Behavior</span>
            <span className="text-xs font-mono font-medium text-status-success">NORMAL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Anomalies</span>
            <span className="text-xs font-mono font-medium text-foreground">0</span>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            Last check: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
