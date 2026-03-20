import { useNavigate } from 'react-router-dom';
import { useRepo } from '@/context/RepoContext';
import StatusBadge from '@/components/shared/StatusBadge';
import {
  LayoutDashboard, MessageSquare, Radio, GitPullRequest,
  ShieldAlert, BookOpen, Container, Brain, FileText, Settings,
  ArrowUpRight, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: MessageSquare, label: 'AI Chat', id: 'chat' },
  { icon: Radio, label: 'Live Feed', id: 'feed' },
  { icon: GitPullRequest, label: 'Pull Requests', id: 'prs' },
  { icon: ShieldAlert, label: 'Vulnerabilities', id: 'vulns' },
  { icon: BookOpen, label: 'Knowledge Base', id: 'kb' },
  { icon: Container, label: 'Sandbox', id: 'docker' },
  { icon: Brain, label: 'ML Shield', id: 'ml' },
  { icon: FileText, label: 'Logs', id: 'logs' },
  { icon: Settings, label: 'Settings', id: 'settings' },
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
    <aside className="w-[240px] min-h-screen flex flex-col border-r border-border bg-sidebar">
      {/* Active Repo */}
      <div className="p-4 border-b border-border">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Active repository
        </p>
        <p className="text-sm font-medium text-foreground truncate">{activeRepo?.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
            {activeRepo?.branch}
          </span>
          <StatusBadge status="ONLINE" />
        </div>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="text-status-error font-medium">{activeRepo?.vulnCount} vulns</span>
          <span>·</span>
          <span>{activeRepo?.lastScan}</span>
        </div>
      </div>

      {/* Recent Repos */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => navigate('/repos')}
          className="flex items-center justify-between w-full mb-2 group"
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            Repos ({recentRepos.length})
          </p>
          <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        {recentRepos.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic">No recent repos</p>
        ) : (
          <div className="space-y-0.5">
            {recentRepos.map(repo => (
              <button
                key={repo.id}
                onClick={() => handleSwitchRepo(repo)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-all text-[12px]
                  ${repo.id === activeRepo?.id
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: repo.status === 'MONITORING'
                      ? 'hsl(142 60% 45%)'
                      : 'hsl(215 12% 48%)',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{repo.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{repo.branch}</span>
                    <span className="text-status-error">{repo.vulnCount}v</span>
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
            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-muted-foreground
                       hover:bg-secondary hover:text-foreground transition-colors text-left group"
          >
            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Agent Status */}
      <div className="p-4 border-t border-border">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
          System status
        </p>
        <div className="space-y-2">
          {[
            { label: 'LLM Engine', status: 'ACTIVE' as const },
            { label: 'RAG Memory', status: 'ENABLED' as const },
            { label: 'ML Shield', status: 'RUNNING' as const },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{row.label}</span>
              <StatusBadge status={row.status} />
            </div>
          ))}
        </div>

        <button
          onClick={() => { setActiveRepo(null); navigate('/'); }}
          className="w-full mt-4 py-2 rounded-md text-[12px] font-medium
                     text-muted-foreground bg-secondary hover:text-foreground
                     active:scale-[0.98] transition-all duration-150
                     flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Switch repo
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
