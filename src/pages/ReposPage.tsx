import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import { MOCK_REPOS } from '@/data/mockData';
import type { Repo } from '@/data/mockData';
import BackgroundAnimation from '@/components/shared/BackgroundAnimation';
import StatusBadge from '@/components/shared/StatusBadge';
import { ArrowLeft, Plus, GitBranch, Users, Star, GitPullRequest as PRIcon } from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  Python: 'hsl(210 80% 56%)',
  TypeScript: 'hsl(210 90% 60%)',
  Go: 'hsl(190 80% 45%)',
  Rust: 'hsl(25 95% 58%)',
  JavaScript: 'hsl(38 92% 50%)',
};

const HealthRing = ({ score }: { score: number }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 85 ? 'hsl(142 60% 45%)' : score >= 60 ? 'hsl(38 92% 50%)' : 'hsl(0 72% 58%)';

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg width="48" height="48" className="rotate-[-90deg]">
        <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(220 12% 14%)" strokeWidth="2.5" />
        <circle
          cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-[11px] font-mono font-semibold text-foreground">{score}</span>
    </div>
  );
};

const VulnBar = ({ label, count, max, color }: { label: string; count: number; max: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] w-14 text-right text-muted-foreground">{label}</span>
    <div className="flex-1 h-1 rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((count / max) * 100, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
    <span className="text-[10px] font-mono w-5 tabular-nums" style={{ color }}>{count}</span>
  </div>
);

const RepoCard = ({ repo, index, onSelect }: { repo: Repo; index: number; onSelect: (r: Repo) => void }) => {
  const maxVuln = Math.max(repo.vulnBreakdown.critical, repo.vulnBreakdown.high, repo.vulnBreakdown.medium, repo.vulnBreakdown.low, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all duration-200 cursor-pointer group
                 shadow-sm hover:shadow-md hover:shadow-black/10"
      onClick={() => onSelect(repo)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: repo.status === 'MONITORING' ? 'hsl(142 60% 45%)' : 'hsl(215 12% 48%)' }} />
            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {repo.name}
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{repo.description}</p>
        </div>
        <HealthRing score={repo.healthScore} />
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground flex items-center gap-1">
          <GitBranch className="w-2.5 h-2.5" />
          {repo.branch}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[repo.language] || 'hsl(215 12% 48%)' }} />
          <span className="text-muted-foreground">{repo.language}</span>
        </span>
        <StatusBadge status={repo.status === 'MONITORING' ? 'ACTIVE' : 'IDLE'} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-3 py-2.5 border-y border-border">
        {[
          { icon: GitBranch, label: 'Commits', value: repo.commits.toLocaleString() },
          { icon: Users, label: 'Team', value: repo.contributors },
          { icon: Star, label: 'Stars', value: repo.stars },
          { icon: PRIcon, label: 'PRs', value: repo.openPRs },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-mono font-semibold text-foreground tabular-nums">{s.value}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Vulnerability Breakdown */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground">
          Vulnerabilities ({repo.vulnCount})
        </p>
        <VulnBar label="Critical" count={repo.vulnBreakdown.critical} max={maxVuln} color="hsl(0 72% 58%)" />
        <VulnBar label="High" count={repo.vulnBreakdown.high} max={maxVuln} color="hsl(38 92% 50%)" />
        <VulnBar label="Medium" count={repo.vulnBreakdown.medium} max={maxVuln} color="hsl(210 80% 56%)" />
        <VulnBar label="Low" count={repo.vulnBreakdown.low} max={maxVuln} color="hsl(142 60% 45%)" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
        <span className="text-[10px] text-muted-foreground">{repo.size}</span>
        <span className="text-[10px] text-muted-foreground">Scanned {repo.lastScan}</span>
        <span className="text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
    </motion.div>
  );
};

const ReposPage = () => {
  const { recentRepos, setActiveRepo, addRecentRepo } = useRepo();
  const navigate = useNavigate();

  const allRepos = [...recentRepos];
  MOCK_REPOS.forEach(mr => {
    if (!allRepos.find(r => r.id === mr.id)) allRepos.push(mr);
  });

  const handleSelect = (repo: Repo) => {
    setActiveRepo(repo);
    addRecentRepo(repo);
    navigate('/dashboard');
  };

  const totalVulns = allRepos.reduce((s, r) => s + r.vulnCount, 0);
  const monitoringCount = allRepos.filter(r => r.status === 'MONITORING').length;

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundAnimation />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-foreground">Repositories</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 rounded-lg text-xs font-medium
                         bg-primary text-primary-foreground hover:brightness-110
                         active:scale-[0.97] transition-all duration-150 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add repo
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: allRepos.length },
              { label: 'Monitoring', value: monitoringCount },
              { label: 'Vulnerabilities', value: totalVulns },
              { label: 'Avg Health', value: Math.round(allRepos.reduce((s, r) => s + r.healthScore, 0) / (allRepos.length || 1)) },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-foreground tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Repo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRepos.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} onSelect={handleSelect} />
          ))}
        </div>

        {allRepos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No repositories connected</p>
            <button onClick={() => navigate('/')} className="mt-4 text-sm text-primary font-medium hover:underline">
              ← Connect your first repo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReposPage;
