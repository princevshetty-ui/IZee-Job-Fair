import { useState, useEffect, useRef } from 'react'

const useCountUp = (target, duration = 1200) => {
  const ref = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    let start = 0
    const steps = 40
    const inc = target / steps
    const interval = setInterval(() => {
      start += inc
      if (start >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(start))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [target, duration])

  return { count, ref }
}

const Card = ({ label, value, color, dot, glow }) => {
  const { count, ref } = useCountUp(value ?? 0)
  return (
    <div
      ref={ref}
      className="rounded-xl p-5 text-center transition-all duration-300 cursor-default"
      style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}
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

const MetricCards = ({ cards }) => {
  if (!cards || cards.length === 0) return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl p-5 animate-pulse"
          style={{ background: '#0D0D1A', border: '1px solid #1a1a2e', height: '88px' }} />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {cards.map(c => (
        <Card key={c.label} label={c.label} value={c.value} color={c.color} dot={c.dot} glow={c.glow} />
      ))}
    </div>
  )
}

export default MetricCards
