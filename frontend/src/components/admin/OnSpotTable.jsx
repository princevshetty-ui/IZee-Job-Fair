import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { apiCall } from '../../utils/api'
import BulkActionBar from './BulkActionBar'
import ProfileModal from './ProfileModal'

const AttendedBadge = ({ attended }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
    style={attended
      ? { background: 'rgba(16,185,129,0.12)', color: '#34d399' }
      : { background: 'rgba(100,116,139,0.10)', color: '#64748b' }
    }>
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ background: attended ? '#10B981' : '#475569' }} />
    {attended ? 'Attended' : 'Not Yet'}
  </span>
)

const TYPE_LABEL = { student: 'Student', fresher: 'Fresher', professional: 'Professional' }

const OnSpotTable = ({ registrations, onRefresh, onToast }) => {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewReg, setViewReg] = useState(null)
  const [acting, setActing] = useState(false)

  useEffect(() => { setSelectedIds(new Set()) }, [search, filterType])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return registrations.filter(r => {
      const matchSearch = !q || (r.full_name || '').toLowerCase().includes(q) || (r.phone || '').includes(q) || (r.sid || '').toLowerCase().includes(q)
      const matchType = filterType === 'all' || r.attendee_type === filterType
      return matchSearch && matchType
    })
  }, [registrations, search, filterType])

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(filtered.map(r => r.id)))
  const toggleOne = (id) => setSelectedIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const withLoading = async (fn) => { setActing(true); try { await fn() } finally { setActing(false) } }

  const handleResend = (reg) => withLoading(async () => {
    await apiCall(`/api/admin/resend/${reg.id}`, { method: 'POST' })
    onToast(`Pass sent to ${reg.email}`)
  })

  const handleBulkResend = () => withLoading(async () => {
    const ids = [...selectedIds]
    const res = await apiCall('/api/admin/bulk-resend', { method: 'POST', body: JSON.stringify({ ids }) })
    const data = await res.json()
    onToast(`${data.queued} passes queued for sending`)
    setSelectedIds(new Set())
  })

  const bulkActions = [
    { label: `Resend Passes (${selectedIds.size})`, onClick: handleBulkResend, bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)', disabled: acting },
  ]

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {selectedIds.size > 0 && <BulkActionBar count={selectedIds.size} actions={bulkActions} />}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search name, phone, SID…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="admin-filter">
          <option value="all">All Types</option>
          <option value="student">Student</option>
          <option value="fresher">Fresher</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      <div className="text-xs" style={{ color: '#334155' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</div>

      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="form-checkbox" />
              </th>
              <th>Name</th><th>Phone</th><th>SID</th><th>Type</th><th>City</th><th>Attended</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10" style={{ color: 'rgba(238,230,216,0.25)' }}>No records found</td></tr>
            ) : filtered.map((reg) => (
              <tr key={reg.id}
                style={selectedIds.has(reg.id) ? { background: 'rgba(99,102,241,0.06)', borderLeft: '2px solid rgba(99,102,241,0.4)' } : {}}
              >
                <td onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedIds.has(reg.id)} onChange={() => toggleOne(reg.id)} className="form-checkbox" />
                </td>
                <td className="font-medium text-white cursor-pointer" onClick={() => setViewReg(reg)}>{reg.full_name}</td>
                <td>{reg.phone}</td>
                <td className="font-mono text-xs">{reg.sid || '—'}</td>
                <td>
                  <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                    {TYPE_LABEL[reg.attendee_type] || reg.attendee_type || '—'}
                  </span>
                </td>
                <td>{reg.city || '—'}</td>
                <td><AttendedBadge attended={!!reg.attended} /></td>
                <td>
                  <div className="flex gap-1.5">
                    <button type="button" className="action-btn resend" disabled={acting} onClick={e => { e.stopPropagation(); handleResend(reg) }}>Resend</button>
                    <button type="button" className="action-btn" onClick={e => { e.stopPropagation(); setViewReg(reg) }}
                      style={{ background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' }}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewReg && <ProfileModal registration={viewReg} onClose={() => setViewReg(null)} />}
    </div>
  )
}

export default OnSpotTable
