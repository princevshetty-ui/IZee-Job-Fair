import React from 'react';
const GlobalBackground = () => {
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#020208' }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Primary indigo orb top-right */}
        <div
          className="absolute rounded-full blur-[120px] orb-1"
          style={{
            pointerEvents: 'none',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.04) 50%, transparent 100%)',
            right: '-10%',
            top: '-15%',
          }}
        />
        {/* Cyan orb bottom-left */}
        <div
          className="absolute rounded-full blur-[140px] orb-2"
          style={{
            pointerEvents: 'none',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.03) 50%, transparent 100%)',
            left: '-8%',
            bottom: '10%',
          }}
        />
        {/* Purple orb center */}
        <div
          className="absolute rounded-full blur-[180px] orb-3"
          style={{
            pointerEvents: 'none',
            width: 800,
            height: 800,
            background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 50%, transparent 100%)',
            left: '30%',
            top: '30%',
          }}
        />
      </div>
    </>
  )
}

export default GlobalBackground
