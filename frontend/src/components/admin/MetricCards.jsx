import { useState, useEffect, useRef } from 'react'

const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || target === 0) return
    const steps = 40
    const inc = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += inc
      if (current >= target) { setCount(target); clearInterval(interval) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(interval)
  }, [started, target, duration])

  return { count, ref }
}

const CFG = [
  { key: 'total_pre_registered', label: 'Pre-Registered', color: '#818CF8', dot: '#6366F1', glow: 'rgba(99,102,241,0.15)' },
  { key: 'total_onspot', label: 'On-Spot', color: '#38bdf8', dot: '#0ea5e9', glow: 'rgba(14,165,233,0.15)' },
  { key: 'approved', label: 'Approved', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
  { key: 'attended', label: 'Attended', color: '#2dd4bf', dot: '#14b8a6', glow: 'rgba(20,184,166,0.15)' },
  { key: 'pending', label: 'Pending', color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  { key: 'rejected', label: 'Rejected', color: '#f87171', dot: '#EF4444', glow: 'rgba(239,68,68,0.15)' }
]

const Card = ({ label, value, color, dot, glow }) => {
  const { count, ref } = useCountUp(value ?? 0)
  return (
    <div
      ref={ref}
      className="rounded-xl p-5 text-center transition-all duration-300 group cursor-default"
      style={{
        background: '#0D0D1A',
        border: '1px solid #1a1a2e',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = dot + '40'
        e.currentTarget.style.boxShadow = `0 0 24px ${glow}, 0 8px 32px rgba(0,0,0,0.3)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1a1a2e'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot, boxShadow: `0 0 6px ${dot}` }} />
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#475569' }}>{label}</p>
      </div>
      <div className="text-3xl font-bold tracking-tight" style={{ color }}>{count.toLocaleString()}</div>
    </div>
  )
}

const MetricCards = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
    {CFG.map(c => <Card key={c.key} label={c.label} value={metrics[c.key]} color={c.color} dot={c.dot} glow={c.glow} />)}
  </div>
)

export default MetricCards
