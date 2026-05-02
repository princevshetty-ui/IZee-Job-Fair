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
  { key: 'total_pre_registered', label: 'Pre-Registered', color: '#a78bfa', dot: '#8b5cf6' },
  { key: 'total_onspot', label: 'On-Spot', color: '#38bdf8', dot: '#0ea5e9' },
  { key: 'approved', label: 'Approved', color: '#34d399', dot: '#10b981' },
  { key: 'attended', label: 'Attended', color: '#2dd4bf', dot: '#14b8a6' },
  { key: 'pending', label: 'Pending', color: '#fbbf24', dot: '#f59e0b' },
  { key: 'rejected', label: 'Rejected', color: '#fb7185', dot: '#f43f5e' }
]

const Card = ({ label, value, color, dot }) => {
  const { count, ref } = useCountUp(value ?? 0)
  return (
    <div ref={ref} className="admin-card rounded-xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'rgba(238,230,216,0.5)' }}>{label}</p>
      </div>
      <div className="text-3xl font-bold tracking-tight" style={{ color }}>{count.toLocaleString()}</div>
    </div>
  )
}

const MetricCards = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
    {CFG.map(c => <Card key={c.key} label={c.label} value={metrics[c.key]} color={c.color} dot={c.dot} />)}
  </div>
)

export default MetricCards