interface StatusBadgeProps {
  status: 'ACTIVE' | 'RUNNING' | 'ENABLED' | 'IDLE' | 'ONLINE' | 'NORMAL' | 'WARNING' | 'CRITICAL';
}

const colorMap: Record<string, string> = {
  ACTIVE: 'bg-cyber-green/20 text-cyber-green',
  RUNNING: 'bg-cyber-cyan/20 text-cyber-cyan',
  ENABLED: 'bg-cyber-green/20 text-cyber-green',
  ONLINE: 'bg-cyber-green/20 text-cyber-green',
  NORMAL: 'bg-cyber-green/20 text-cyber-green',
  IDLE: 'bg-cyber-yellow/20 text-cyber-yellow',
  WARNING: 'bg-cyber-yellow/20 text-cyber-yellow',
  CRITICAL: 'bg-cyber-red/20 text-cyber-red',
};

const dotMap: Record<string, string> = {
  ACTIVE: 'bg-cyber-green',
  RUNNING: 'bg-cyber-cyan',
  ENABLED: 'bg-cyber-green',
  ONLINE: 'bg-cyber-green',
  NORMAL: 'bg-cyber-green',
  IDLE: 'bg-cyber-yellow',
  WARNING: 'bg-cyber-yellow',
  CRITICAL: 'bg-cyber-red',
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider ${colorMap[status] || 'bg-muted text-muted-foreground'}`}>
    <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${dotMap[status] || 'bg-muted-foreground'}`} />
    {status}
  </span>
);

export default StatusBadge;
