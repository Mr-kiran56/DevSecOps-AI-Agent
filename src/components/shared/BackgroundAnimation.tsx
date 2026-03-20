const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Subtle gradient orbs - very muted */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, hsl(25 95% 58%) 0%, transparent 70%)',
          top: '-200px',
          right: '-100px',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, hsl(210 80% 56%) 0%, transparent 70%)',
          bottom: '-150px',
          left: '-100px',
        }}
      />
      {/* Fine grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(210 20% 92%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 20% 92%) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
