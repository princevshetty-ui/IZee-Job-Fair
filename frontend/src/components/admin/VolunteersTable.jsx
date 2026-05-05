import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { apiCall } from '../../utils/api'
import BulkActionBar from './BulkActionBar'

const PAGE_SIZE = 25

const VolunteersTable = ({ volunteers, onRefresh, onToast }) => {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showConfirm, setShowConfirm] = useState(false)
  const [acting, setActing] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => { setSelectedIds(new Set()); setPage(1) }, [search])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return volunteers.filter(v =>
      !q || (v.full_name || '').toLowerCase().includes(q) || (v.roll_number || '').toLowerCase().includes(q)
    )
  }, [volunteers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(filtered.map(v => v.id)))
  const toggleOne = (id) => setSelectedIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const handleBulkDelete = async () => {
    setActing(true)
    setShowConfirm(false)
    try {
      const ids = [...selectedIds]
      const res = await apiCall('/api/admin/volunteers/delete', { method: 'POST', body: JSON.stringify({ ids }) })
      const data = await res.json()
      onToast(`${data.deleted} volunteer${data.deleted !== 1 ? 's' : ''} deleted`, 'info')
      setSelectedIds(new Set())
      await onRefresh()
    } finally {
      setActing(false)
    }
  }

  const bulkActions = [
    {
      label: `Delete Selected (${selectedIds.size})`,
      onClick: () => setShowConfirm(true),
      bg: 'rgba(239,68,68,0.08)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.25)',
      disabled: acting,
    },
  ]

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {selectedIds.size > 0 && <BulkActionBar count={selectedIds.size} actions={bulkActions} />}
      </AnimatePresence>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search name or roll number…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search" />
      </div>

      <div className="text-xs" style={{ color: '#334155' }}>{filtered.length} volunteer{filtered.length !== 1 ? 's' : ''}</div>

      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="form-checkbox" />
              </th>
              <th>Name</th><th>Roll Number</th><th>Course</th><th>Year</th><th>Phone</th><th>Email</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10" style={{ color: 'rgba(238,230,216,0.25)' }}>No volunteers found</td></tr>
            ) : paginated.map((v) => (
              <tr key={v.id} style={selectedIds.has(v.id) ? { background: 'rgba(239,68,68,0.04)', borderLeft: '2px solid rgba(239,68,68,0.3)' } : {}}>
                <td>
                  <input type="checkbox" checked={selectedIds.has(v.id)} onChange={() => toggleOne(v.id)} className="form-checkbox" />
                </td>
                <td className="font-medium text-white">{v.full_name}</td>
                <td className="font-mono text-xs">{v.roll_number}</td>
                <td>{v.course || '—'}</td>
                <td>{v.year || '—'}</td>
                <td>{v.phone}</td>
                <td className="text-xs" style={{ color: '#64748b' }}>{v.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-4">
          <span className="text-xs" style={{ color: '#475569' }}>
            Page {page} of {totalPages} · Total: {filtered.length} records
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a2e', color: '#94a3b8' }}>
              Previous
            </button>
            <button type="button" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-30 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a2e', color: '#94a3b8' }}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-sm"
              style={{ background: '#0D0D1A', border: '1px solid rgba(239,68,68,0.25)' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Delete Volunteers?</h3>
              <p className="text-sm mb-6" style={{ color: '#64748b' }}>
                This will permanently delete <strong className="text-white">{selectedIds.size}</strong> volunteer record{selectedIds.size !== 1 ? 's' : ''}. This cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowConfirm(false)} className="admin-button px-4 py-2 text-xs uppercase tracking-[0.1em]">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="px-4 py-2 rounded-lg text-xs uppercase tracking-[0.1em] font-semibold transition-all duration-200"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VolunteersTable
