import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '@/context/RepoContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AIChat from '@/components/dashboard/AIChat';
import SystemMonitor from '@/components/dashboard/SystemMonitor';
import LiveFeed from '@/components/dashboard/LiveFeed';

const DashboardPage = () => {
  const { activeRepo } = useRepo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeRepo) navigate('/');
  }, [activeRepo, navigate]);

  if (!activeRepo) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <DashboardSidebar />
      <div className="flex-1 grid grid-cols-3 min-h-0">
        <div className="border-r border-[var(--border-dim)] overflow-hidden">
          <AIChat />
        </div>
        <div className="border-r border-[var(--border-dim)] overflow-hidden">
          <SystemMonitor />
        </div>
        <div className="overflow-hidden">
          <LiveFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
