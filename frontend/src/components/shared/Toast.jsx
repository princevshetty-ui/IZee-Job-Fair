import { motion } from 'framer-motion'
import { useEffect } from 'react'

const normalizeMessage = (value) => {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.error(error)
    return 'Something went wrong'
  }
}

const ICONS = {
  success: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

const STYLES = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', color: '#10B981' },
  error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', color: '#EF4444' },
  info: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', color: '#6366F1' }
}

const Toast = ({ message, type = 'info', duration = 3500, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => { onClose() }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const s = STYLES[type] || STYLES.info

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium max-w-sm cursor-pointer"
      style={{
        background: '#0D0D1A',
        border: `1px solid ${s.border}`,
        color: s.color,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${s.border}`
      }}
      onClick={onClose}
    >
      {ICONS[type] || ICONS.info}
      <span style={{ color: '#F8FAFC' }}>{normalizeMessage(message)}</span>
    </motion.div>
  )
}

export default Toast
