import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,0.9))]" />
      <div className="absolute w-full h-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 300 + 50 + 'px',
              height: Math.random() * 300 + 50 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: `radial-gradient(circle at center, ${
                ['rgba(59,130,246,0.1)', 'rgba(6,182,212,0.1)', 'rgba(99,102,241,0.1)'][
                  Math.floor(Math.random() * 3)
                ]
              }, transparent)`,
              animation: `float ${Math.random() * 10 + 20}s infinite linear`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;