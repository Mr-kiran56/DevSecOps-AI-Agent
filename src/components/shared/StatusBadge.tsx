interface StatusBadgeProps {
  status: 'ACTIVE' | 'RUNNING' | 'ENABLED' | 'IDLE' | 'ONLINE' | 'NORMAL' | 'WARNING' | 'CRITICAL';
}

const colorMap: Record<string, string> = {
  ACTIVE: 'bg-status-success/10 text-status-success',
  RUNNING: 'bg-status-info/10 text-status-info',
  ENABLED: 'bg-status-success/10 text-status-success',
  ONLINE: 'bg-status-success/10 text-status-success',
  NORMAL: 'bg-status-success/10 text-status-success',
  IDLE: 'bg-status-warning/10 text-status-warning',
  WARNING: 'bg-status-warning/10 text-status-warning',
  CRITICAL: 'bg-status-error/10 text-status-error',
};

const dotMap: Record<string, string> = {
  ACTIVE: 'bg-status-success',
  RUNNING: 'bg-status-info',
  ENABLED: 'bg-status-success',
  ONLINE: 'bg-status-success',
  NORMAL: 'bg-status-success',
  IDLE: 'bg-status-warning',
  WARNING: 'bg-status-warning',
  CRITICAL: 'bg-status-error',
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium tracking-wide ${colorMap[status] || 'bg-muted text-muted-foreground'}`}>
    <span className={`w-1.5 h-1.5 rounded-full animate-pulse-subtle ${dotMap[status] || 'bg-muted-foreground'}`} />
    {status}
  </span>
);

export default StatusBadge;
