import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRepo } from '@/context/RepoContext';
import BackgroundAnimation from '@/components/shared/BackgroundAnimation';
import BootSequence from '@/components/setup/BootSequence';
import { Shield, GitBranch, ArrowRight } from 'lucide-react';
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
      language: 'Python',
      stars: Math.floor(Math.random() * 500),
      commits: Math.floor(Math.random() * 2000) + 100,
      contributors: Math.floor(Math.random() * 20) + 1,
      openPRs: Math.floor(Math.random() * 10),
      size: `${(Math.random() * 100).toFixed(1)} MB`,
      lastActivity: 'just now',
      description: 'Repository connected for security monitoring',
      healthScore: Math.floor(Math.random() * 30) + 70,
      vulnBreakdown: {
        critical: Math.floor(Math.random() * 5),
        high: Math.floor(Math.random() * 10),
        medium: Math.floor(Math.random() * 20),
        low: Math.floor(Math.random() * 15),
      },
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
    `w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 outline-none
     bg-secondary border ${errors[field] ? 'border-destructive ring-2 ring-destructive/20' : 'border-border'}
     text-foreground placeholder:text-muted-foreground
     focus:border-primary focus:ring-2 focus:ring-primary/20`;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      <BackgroundAnimation />
      
      <AnimatePresence>
        {booting && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl shadow-black/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              DevSecOps Agent
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Connect a repository to begin monitoring
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Repository URL
              </label>
              <input
                className={inputClass('url')}
                value={repoUrl}
                onChange={e => { setRepoUrl(e.target.value); setErrors(p => ({ ...p, url: false })); }}
                placeholder="https://github.com/user/repo"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Repository name
                </label>
                <input
                  className={inputClass('name')}
                  value={repoName}
                  onChange={e => { setRepoName(e.target.value); setErrors(p => ({ ...p, name: false })); }}
                  placeholder="my-repo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Branch
                </label>
                <input
                  className={inputClass('branch')}
                  value={branch}
                  onChange={e => { setBranch(e.target.value); setErrors(p => ({ ...p, branch: false })); }}
                  placeholder="main"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6 pt-1">
              {[
                { label: 'ML Shield', value: mlShield, onChange: () => setMlShield(!mlShield) },
                { label: 'RAG Memory', value: ragMemory, onChange: () => setRagMemory(!ragMemory) },
              ].map(toggle => (
                <label key={toggle.label} className="flex items-center gap-2.5 cursor-pointer text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={toggle.onChange}
                    className={`w-9 h-5 rounded-full transition-colors relative ${toggle.value ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${toggle.value ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                  {toggle.label}
                </label>
              ))}
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full mt-2 py-2.5 rounded-lg font-medium text-sm
                         bg-primary text-primary-foreground
                         hover:brightness-110 active:scale-[0.98] transition-all duration-150
                         flex items-center justify-center gap-2"
            >
              Start monitoring
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recently Monitored */}
        {recentRepos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5"
          >
            <h3 className="text-xs font-medium text-muted-foreground mb-2.5">
              Recent repositories
            </h3>
            <div className="flex gap-2 flex-wrap">
              {recentRepos.map(repo => (
                <button
                  key={repo.id}
                  onClick={() => handleRecentClick(repo)}
                  className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-mono flex items-center gap-2
                             hover:border-primary/30 hover:bg-secondary active:scale-[0.97] transition-all duration-150"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${repo.status === 'MONITORING' ? 'bg-status-success animate-pulse-subtle' : 'bg-status-warning'}`} />
                  <span className="text-foreground">{repo.name}</span>
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
