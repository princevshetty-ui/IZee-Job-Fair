import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { apiCall } from '../../utils/api'
import BulkActionBar from './BulkActionBar'
import ProfileModal from './ProfileModal'

const StatusBadge = ({ status }) => {
  const cfg = {
    pending: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', dot: '#F59E0B', label: 'Pending' },
    approved: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', dot: '#10B981', label: 'Approved' },
    rejected: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', dot: '#EF4444', label: 'Rejected' },
  }[status] || { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', dot: '#64748b', label: status || '—' }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

const RegistrationsTable = ({ registrations, onRefresh, onToast }) => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewReg, setViewReg] = useState(null)
  const [acting, setActing] = useState(false)

  useEffect(() => { setSelectedIds(new Set()) }, [search, filterStatus, filterLevel])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return registrations.filter(r => {
      const matchSearch = !q || (r.full_name || '').toLowerCase().includes(q) || (r.phone || '').includes(q) || (r.sid || '').toLowerCase().includes(q)
      const matchStatus = filterStatus === 'all' || r.status === filterStatus
      const matchLevel = filterLevel === 'all' || r.academic_level === filterLevel
      return matchSearch && matchStatus && matchLevel
    })
  }, [registrations, search, filterStatus, filterLevel])

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length
  const toggleAll = () => setSelectedIds(allSelected ? new Set() : new Set(filtered.map(r => r.id)))
  const toggleOne = (id) => setSelectedIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const withLoading = async (fn) => { setActing(true); try { await fn() } finally { setActing(false) } }

  const handleApprove = (reg) => withLoading(async () => {
    await apiCall(`/api/admin/approve/${reg.id}`, { method: 'PUT' })
    onToast(`Pass sent to ${reg.email}`)
    await onRefresh()
  })

  const handleReject = (reg) => withLoading(async () => {
    await apiCall(`/api/admin/reject/${reg.id}`, { method: 'PUT' })
    onToast('Registration rejected', 'info')
    await onRefresh()
  })

  const handleResend = (reg) => withLoading(async () => {
    await apiCall(`/api/admin/resend/${reg.id}`, { method: 'POST' })
    onToast(`Pass sent to ${reg.email}`)
  })

  const handleBulkApprove = () => withLoading(async () => {
    const ids = [...selectedIds]
    const res = await apiCall('/api/admin/bulk-approve', { method: 'POST', body: JSON.stringify({ ids }) })
    const data = await res.json()
    onToast(`${data.approved} passes queued for sending`)
    setSelectedIds(new Set())
    await onRefresh()
  })

  const handleBulkResend = () => withLoading(async () => {
    const ids = [...selectedIds]
    const res = await apiCall('/api/admin/bulk-resend', { method: 'POST', body: JSON.stringify({ ids }) })
    const data = await res.json()
    onToast(`${data.queued} passes queued for sending`)
    setSelectedIds(new Set())
  })

  const handleBulkReject = () => withLoading(async () => {
    const ids = [...selectedIds]
    await Promise.all(ids.map(id => apiCall(`/api/admin/reject/${id}`, { method: 'PUT' })))
    onToast(`${ids.length} registrations rejected`, 'info')
    setSelectedIds(new Set())
    await onRefresh()
  })

  const bulkActions = [
    { label: `Approve Selected (${selectedIds.size})`, onClick: handleBulkApprove, bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)', disabled: acting },
    { label: `Resend Passes (${selectedIds.size})`, onClick: handleBulkResend, bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)', disabled: acting },
    { label: `Reject Selected (${selectedIds.size})`, onClick: handleBulkReject, bg: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'rgba(239,68,68,0.25)', disabled: acting },
  ]

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && <BulkActionBar count={selectedIds.size} actions={bulkActions} />}
      </AnimatePresence>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search name, phone, SID…" value={search} onChange={e => setSearch(e.target.value)} className="admin-search" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin-filter">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="admin-filter">
          <option value="all">All Levels</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="Diploma">Diploma</option>
          <option value="ITI">ITI</option>
          <option value="PUC">PUC</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>

      <div className="text-xs" style={{ color: '#334155' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="form-checkbox" />
              </th>
              <th>Name</th><th>Phone</th><th>SID</th><th>Level</th><th>City</th><th>Status</th><th>Actions</th>
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
                <td>{reg.academic_level || '—'}</td>
                <td>{reg.city || '—'}</td>
                <td><StatusBadge status={reg.status} /></td>
                <td>
                  <div className="flex gap-1.5 flex-wrap">
                    {reg.status === 'pending' && (
                      <>
                        <button type="button" className="action-btn approve" disabled={acting} onClick={e => { e.stopPropagation(); handleApprove(reg) }}>Approve</button>
                        <button type="button" className="action-btn reject" disabled={acting} onClick={e => { e.stopPropagation(); handleReject(reg) }}>Reject</button>
                      </>
                    )}
                    {reg.status === 'approved' && (
                      <button type="button" className="action-btn resend" disabled={acting} onClick={e => { e.stopPropagation(); handleResend(reg) }}>Resend</button>
                    )}
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

export default RegistrationsTable
