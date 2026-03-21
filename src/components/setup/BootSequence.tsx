import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

const STEPS = [
  { loading: 'Connecting to repository...', done: 'Repository connected' },
  { loading: 'Indexing codebase...', done: 'Codebase indexed — 910 files' },
  { loading: 'Loading ML models...', done: 'ML models ready' },
  { loading: 'Starting analysis agents...', done: '6 agents active' },
  { loading: 'Bringing system online...', done: 'System online' },
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    >
      <div className="w-full max-w-sm space-y-4 px-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={i <= currentStep ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-sm"
          >
            {stepsComplete[i] ? (
              <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
            ) : i === currentStep ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />
            )}
            <span className={`${stepsComplete[i] ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {stepsComplete[i] ? step.done : step.loading}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-foreground">
                  Ready to go
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  All systems operational
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BootSequence;
