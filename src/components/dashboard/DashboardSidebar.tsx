import { useNavigate } from 'react-router-dom';
import { useRepo } from '@/context/RepoContext';
import StatusBadge from '@/components/shared/StatusBadge';

const NAV_ITEMS = [
  { icon: '◎', label: 'Dashboard', id: 'dashboard' },
  { icon: '⬡', label: 'AI Chat', id: 'chat' },
  { icon: '◈', label: 'Live Feed', id: 'feed' },
  { icon: '⬟', label: 'Pull Requests', id: 'prs' },
  { icon: '⚑', label: 'Vulnerabilities', id: 'vulns' },
  { icon: '◇', label: 'Knowledge Base', id: 'kb' },
  { icon: '▣', label: 'Docker Sandbox', id: 'docker' },
  { icon: '◆', label: 'ML Shield', id: 'ml' },
  { icon: '≡', label: 'Logs', id: 'logs' },
  { icon: '⚙', label: 'Settings', id: 'settings' },
];

const DashboardSidebar = () => {
  const { activeRepo, setActiveRepo, recentRepos, addRecentRepo } = useRepo();
  const navigate = useNavigate();

  const handleSwitchRepo = (repo: typeof activeRepo) => {
    if (repo && repo.id !== activeRepo?.id) {
      setActiveRepo(repo);
      addRecentRepo(repo);
    }
  };

  return (
    <aside className="w-[220px] min-h-screen flex flex-col border-r border-[var(--border-dim)]" style={{ background: 'var(--bg-panel)' }}>
      {/* Active Repo */}
      <div className="p-4 border-b border-[var(--border-dim)]">
        <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
          Active Repo
        </p>
        <p className="font-mono text-sm font-medium text-foreground truncate">{activeRepo?.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted" style={{ color: 'var(--text-secondary)' }}>
            {activeRepo?.branch}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-dot" />
          <span className="text-[10px] font-mono" style={{ color: 'var(--accent-green)' }}>ONLINE</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] font-mono" style={{ color: 'var(--accent-red)' }}>
            {activeRepo?.vulnCount} vulns
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
            scanned {activeRepo?.lastScan}
          </span>
        </div>
      </div>

      {/* Recent Repos */}
      <div className="p-4 border-b border-[var(--border-dim)]">
        <button
          onClick={() => navigate('/repos')}
          className="flex items-center justify-between w-full mb-2 group"
        >
          <p className="text-[10px] font-mono uppercase tracking-wider group-hover:text-cyber-cyan transition-colors" style={{ color: 'var(--text-dim)' }}>
            Recent Repos ({recentRepos.length})
          </p>
          <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-cyan)' }}>
            View All →
          </span>
        </button>
        {recentRepos.length === 0 ? (
          <p className="text-[10px] font-mono italic" style={{ color: 'var(--text-dim)' }}>No recent repos</p>
        ) : (
          <div className="space-y-1">
            {recentRepos.map(repo => (
              <button
                key={repo.id}
                onClick={() => handleSwitchRepo(repo)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all text-[11px] font-mono
                  ${repo.id === activeRepo?.id
                    ? 'bg-[var(--bg-card)] border border-[var(--border-glow)]'
                    : 'hover:bg-[var(--bg-card)] border border-transparent'
                  }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: repo.status === 'MONITORING' ? 'var(--accent-green)' : 'var(--text-dim)',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-foreground">{repo.name}</p>
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--text-dim)' }}>{repo.branch}</span>
                    <span style={{ color: 'var(--accent-red)', fontSize: '9px' }}>{repo.vulnCount}v</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-colors
                       hover:bg-[var(--bg-card)] group text-left"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="text-sm group-hover:text-cyber-cyan transition-colors">{item.icon}</span>
            <span className="group-hover:text-foreground transition-colors">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Agent Status */}
      <div className="p-4 border-t border-[var(--border-dim)]">
        <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>
          Agent Status
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>LLM Engine</span>
            <StatusBadge status="ACTIVE" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>RAG Memory</span>
            <StatusBadge status="ENABLED" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>ML Shield</span>
            <StatusBadge status="RUNNING" />
          </div>
        </div>

        <button
          onClick={() => { setActiveRepo(null); navigate('/'); }}
          className="w-full mt-4 py-2 rounded-md text-[11px] font-mono uppercase tracking-wider
                     border border-[var(--border-dim)] hover:border-[var(--border-glow)] transition-all"
          style={{ color: 'var(--text-secondary)' }}
        >
          Switch Repo
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
