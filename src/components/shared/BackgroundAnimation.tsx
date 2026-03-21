const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Warm gradient wash */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, hsl(35 60% 90%) 0%, transparent 70%)',
          top: '-300px',
          right: '-200px',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, hsl(24 50% 85%) 0%, transparent 70%)',
          bottom: '-200px',
          left: '-150px',
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
