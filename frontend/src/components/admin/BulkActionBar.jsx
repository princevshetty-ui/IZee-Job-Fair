import { motion } from 'framer-motion'

const BulkActionBar = ({ count, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: -14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -14 }}
    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl mb-4"
    style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)' }}
  >
    <span className="text-xs font-bold tracking-[0.08em]" style={{ color: '#a5b4fc' }}>
      {count} selected
    </span>
    <div className="h-4 w-px" style={{ background: 'rgba(99,102,241,0.3)' }} />
    {actions.map((action, i) => (
      <button
        key={i}
        type="button"
        onClick={action.onClick}
        disabled={action.disabled}
        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 disabled:opacity-40"
        style={{ background: action.bg, color: action.color, border: `1px solid ${action.border}` }}
        onMouseEnter={e => { if (!action.disabled) e.currentTarget.style.opacity = '0.82' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        {action.label}
      </button>
    ))}
  </motion.div>
)

export default BulkActionBar
