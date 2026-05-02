import { useState } from 'react'
import { motion } from 'framer-motion'

export const Orb = ({ size, initialX, initialY, colors, duration, delay }) => (
  <motion.div
    className="absolute rounded-full blur-[100px] pointer-events-none will-change-transform"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle at 50% 50%, ${colors[0]} 0%, ${colors[1]} 50%, transparent 100%)`,
      left: initialX,
      top: initialY
    }}
    animate={{
      x: [0, 80, -60, 100, 0],
      y: [0, -70, 60, -40, 0],
      scale: [1, 1.15, 0.9, 1.1, 1]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay
    }}
  />
)

export const GlobalParticles = () => {
  const [particles] = useState(() => Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.6 + 0.4
  })))

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-gradient-to-b from-cyan-300 to-blue-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity, filter: 'blur(0.5px)' }}
          animate={{ y: [0, -600], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  )
}

const GlobalBackground = () => {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 40%, #0f1628 100%)'
        }}
      />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        <Orb size={600} initialX="80%" initialY="-10%" colors={['rgba(99,102,241,0.15)', 'rgba(99,102,241,0.03)']} duration={25} delay={0} />
        <Orb size={500} initialX="-5%" initialY="70%" colors={['rgba(34,211,238,0.15)', 'rgba(34,211,238,0.03)']} duration={30} delay={2} />
        <Orb size={700} initialX="50%" initialY="50%" colors={['rgba(79,70,229,0.1)', 'rgba(14,165,233,0.05)']} duration={28} delay={4} />
      </div>

      <GlobalParticles />
    </>
  )
}

export default GlobalBackground
