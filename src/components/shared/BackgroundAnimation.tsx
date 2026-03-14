import { useMemo } from 'react';

const BackgroundAnimation = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 2,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 8,
      color: Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-purple)',
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.2,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
