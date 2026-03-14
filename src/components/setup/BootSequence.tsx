import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const STEPS = [
  { icon: '⬡', loading: 'Connecting to GitHub...', done: '✓ Connected' },
  { icon: '◈', loading: 'Initializing Vector Memory (ChromaDB)...', done: '✓ 910 vectors loaded' },
  { icon: '⬟', loading: 'Warming ML Shield (IsolationForest)...', done: '✓ Model ready' },
  { icon: '◎', loading: 'LangGraph agents spinning up...', done: '✓ 6 nodes active' },
  { icon: '▶', loading: 'Bringing agent online...', done: 'Agent ONLINE' },
];

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsComplete, setStepsComplete] = useState<boolean[]>(new Array(STEPS.length).fill(false));
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      setTimeout(() => setAllDone(true), 400);
      setTimeout(onComplete, 1800);
      return;
    }

    const timer = setTimeout(() => {
      setStepsComplete(prev => {
        const next = [...prev];
        next[currentStep] = true;
        return next;
      });
      setTimeout(() => setCurrentStep(s => s + 1), 200);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-md space-y-4 px-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={i <= currentStep ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex items-center gap-3 font-mono text-sm"
          >
            <span className="text-lg" style={{ color: stepsComplete[i] ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>
              {stepsComplete[i] ? '✓' : step.icon}
            </span>
            <span style={{ color: stepsComplete[i] ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
              {stepsComplete[i] ? step.done : step.loading}
            </span>
            {!stepsComplete[i] && i === currentStep && (
              <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: 'var(--accent-cyan)' }} />
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'var(--bg-base)' }}
          >
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-display font-bold tracking-tight"
                style={{ color: 'var(--accent-green)', textShadow: '0 0 40px rgba(0,255,136,0.4)' }}
              >
                AGENT ONLINE
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                All systems operational
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BootSequence;
