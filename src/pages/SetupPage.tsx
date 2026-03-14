import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import BackgroundAnimation from '@/components/shared/BackgroundAnimation';
import BootSequence from '@/components/setup/BootSequence';
import type { Repo } from '@/data/mockData';

const SetupPage = () => {
  const navigate = useNavigate();
  const { setActiveRepo, addRecentRepo, recentRepos } = useRepo();
  const [repoUrl, setRepoUrl] = useState('https://github.com/org/payment-service');
  const [repoName, setRepoName] = useState('payment-service');
  const [branch, setBranch] = useState('main');
  const [mlShield, setMlShield] = useState(true);
  const [ragMemory, setRagMemory] = useState(true);
  const [booting, setBooting] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleStart = () => {
    const newErrors: Record<string, boolean> = {};
    if (!repoUrl.trim()) newErrors.url = true;
    if (!repoName.trim()) newErrors.name = true;
    if (!branch.trim()) newErrors.branch = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setBooting(true);
  };

  const handleBootComplete = () => {
    const repo: Repo = {
      id: repoName,
      name: repoName,
      url: repoUrl,
      branch,
      status: 'MONITORING',
      vulnCount: Math.floor(Math.random() * 50) + 10,
      lastScan: 'just now',
      mlShield,
      ragMemory,
    };
    setActiveRepo(repo);
    addRecentRepo(repo);
    navigate('/dashboard');
  };

  const handleRecentClick = (repo: Repo) => {
    setRepoUrl(repo.url);
    setRepoName(repo.name);
    setBranch(repo.branch);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 outline-none
     bg-[var(--bg-card)] border ${errors[field] ? 'border-cyber-red shadow-[0_0_12px_rgba(255,51,102,0.3)]' : 'border-[var(--border-dim)]'}
     text-foreground placeholder:text-muted-foreground
     focus:border-[var(--accent-cyan)] focus:shadow-[0_0_12px_rgba(0,212,255,0.2)]`;

  return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <BackgroundAnimation />
      
      <AnimatePresence>
        {booting && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="text-3xl" style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.5))' }}>⬡</span>
              <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
                DevSecOps AI Agent
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Connect a repository to begin monitoring
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                GitHub Repository URL
              </label>
              <input
                className={inputClass('url')}
                value={repoUrl}
                onChange={e => { setRepoUrl(e.target.value); setErrors(p => ({ ...p, url: false })); }}
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                Repository Name
              </label>
              <input
                className={inputClass('name')}
                value={repoName}
                onChange={e => { setRepoName(e.target.value); setErrors(p => ({ ...p, name: false })); }}
                placeholder="my-repo"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                Branch
              </label>
              <input
                className={inputClass('branch')}
                value={branch}
                onChange={e => { setBranch(e.target.value); setErrors(p => ({ ...p, branch: false })); }}
                placeholder="main"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
                <button
                  type="button"
                  onClick={() => setMlShield(!mlShield)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${mlShield ? 'bg-cyber-cyan/30' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${mlShield ? 'left-5 bg-cyber-cyan shadow-[0_0_8px_rgba(0,212,255,0.5)]' : 'left-0.5 bg-muted-foreground'}`} />
                </button>
                ML Shield
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
                <button
                  type="button"
                  onClick={() => setRagMemory(!ragMemory)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${ragMemory ? 'bg-cyber-purple/30' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${ragMemory ? 'left-5 bg-cyber-purple shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'left-0.5 bg-muted-foreground'}`} />
                </button>
                RAG Memory
              </label>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full mt-4 py-3.5 rounded-lg font-display font-bold text-sm uppercase tracking-wider
                         bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground
                         hover:translate-y-[-1px] transition-all duration-200
                         animate-glow-pulse"
            >
              ▶ START MONITORING
            </button>
          </div>
        </div>

        {/* Recently Monitored */}
        {recentRepos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h3 className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-dim)' }}>
              Recently Monitored
            </h3>
            <div className="flex gap-2 flex-wrap">
              {recentRepos.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => handleRecentClick(repo)}
                  className="glass-card px-3 py-1.5 text-xs font-mono flex items-center gap-2 hover:border-[var(--border-glow)] transition-all"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${repo.status === 'MONITORING' ? 'bg-cyber-green animate-pulse-dot' : 'bg-cyber-yellow'}`} />
                  {repo.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SetupPage;
