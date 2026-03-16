import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import { MOCK_REPOS } from '@/data/mockData';
import type { Repo } from '@/data/mockData';
import BackgroundAnimation from '@/components/shared/BackgroundAnimation';
import StatusBadge from '@/components/shared/StatusBadge';

const LANG_COLORS: Record<string, string> = {
  Python: 'var(--accent-cyan)',
  TypeScript: 'var(--accent-purple)',
  Go: 'var(--accent-green)',
  Rust: 'var(--accent-red)',
  JavaScript: 'var(--accent-yellow)',
};

const HealthRing = ({ score }: { score: number }) => {
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 85 ? 'var(--accent-green)' : score >= 60 ? 'var(--accent-yellow)' : 'var(--accent-red)';

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg width="56" height="56" className="rotate-[-90deg]">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border-dim)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-mono font-bold text-foreground">{score}</span>
    </div>
  );
};

const VulnBar = ({ label, count, max, color }: { label: string; count: number; max: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-mono w-14 text-right" style={{ color: 'var(--text-dim)' }}>{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-card)]">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((count / max) * 100, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
    <span className="text-[10px] font-mono w-6" style={{ color }}>{count}</span>
  </div>
);

const RepoCard = ({ repo, index, onSelect }: { repo: Repo; index: number; onSelect: (r: Repo) => void }) => {
  const maxVuln = Math.max(repo.vulnBreakdown.critical, repo.vulnBreakdown.high, repo.vulnBreakdown.medium, repo.vulnBreakdown.low, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card p-5 hover:border-[var(--border-glow)] transition-all cursor-pointer group"
      onClick={() => onSelect(repo)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: repo.status === 'MONITORING' ? 'var(--accent-green)' : 'var(--text-dim)' }} />
            <h3 className="font-mono text-sm font-bold text-foreground truncate group-hover:text-cyber-cyan transition-colors">
              {repo.name}
            </h3>
          </div>
          <p className="text-[11px] line-clamp-1" style={{ color: 'var(--text-dim)' }}>{repo.description}</p>
        </div>
        <HealthRing score={repo.healthScore} />
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted" style={{ color: 'var(--text-secondary)' }}>
          ⎇ {repo.branch}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[repo.language] || 'var(--text-dim)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{repo.language}</span>
        </span>
        <StatusBadge status={repo.status === 'MONITORING' ? 'ACTIVE' : 'IDLE'} />
        {repo.mlShield && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)' }}>ML SHIELD</span>}
        {repo.ragMemory && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-purple)' }}>RAG</span>}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-3 py-2 border-y border-[var(--border-dim)]">
        {[
          { label: 'Commits', value: repo.commits.toLocaleString() },
          { label: 'Contributors', value: repo.contributors },
          { label: 'Stars', value: repo.stars },
          { label: 'Open PRs', value: repo.openPRs },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-sm font-mono font-bold text-foreground">{s.value}</p>
            <p className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Vulnerability Breakdown */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
          Vulnerabilities ({repo.vulnCount})
        </p>
        <VulnBar label="Critical" count={repo.vulnBreakdown.critical} max={maxVuln} color="var(--accent-red)" />
        <VulnBar label="High" count={repo.vulnBreakdown.high} max={maxVuln} color="var(--accent-yellow)" />
        <VulnBar label="Medium" count={repo.vulnBreakdown.medium} max={maxVuln} color="var(--accent-cyan)" />
        <VulnBar label="Low" count={repo.vulnBreakdown.low} max={maxVuln} color="var(--accent-green)" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border-dim)]">
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
          Size: {repo.size}
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
          Scanned {repo.lastScan}
        </span>
        <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-cyan)' }}>
          OPEN →
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
    <div className="relative min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <BackgroundAnimation />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="text-sm font-mono hover:text-cyber-cyan transition-colors" style={{ color: 'var(--text-dim)' }}>
                ← Setup
              </button>
              <span style={{ color: 'var(--border-dim)' }}>|</span>
              <h1 className="text-xl font-display font-bold text-foreground">All Repositories</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider
                         border border-[var(--border-dim)] hover:border-[var(--border-glow)] transition-all"
              style={{ color: 'var(--accent-cyan)' }}
            >
              + Add Repo
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Repos', value: allRepos.length, color: 'var(--accent-cyan)' },
              { label: 'Monitoring', value: monitoringCount, color: 'var(--accent-green)' },
              { label: 'Total Vulnerabilities', value: totalVulns, color: 'var(--accent-red)' },
              { label: 'Avg Health', value: Math.round(allRepos.reduce((s, r) => s + r.healthScore, 0) / (allRepos.length || 1)), color: 'var(--accent-purple)' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-mono font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider mt-1" style={{ color: 'var(--text-dim)' }}>{stat.label}</p>
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
            <p className="text-lg font-mono" style={{ color: 'var(--text-dim)' }}>No repositories connected</p>
            <button onClick={() => navigate('/')} className="mt-4 text-sm font-mono" style={{ color: 'var(--accent-cyan)' }}>
              ← Connect your first repo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReposPage;
