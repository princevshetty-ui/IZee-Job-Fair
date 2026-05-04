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
    if (!started || target === 0) { setCount(target); return }
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
  if (!cards || cards.length === 0) return null
  const cols = cards.length <= 3 ? cards.length : cards.length <= 4 ? 4 : cards.length <= 5 ? 5 : 6
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(cols, 3)} xl:grid-cols-${cols} gap-3 mb-6`}>
      {cards.map(c => (
        <Card key={c.label} label={c.label} value={c.value} color={c.color} dot={c.dot} glow={c.glow} />
      ))}
    </div>
  )
}

export default MetricCards
