import { useState } from 'react'
import ProfileModal from './ProfileModal'

const RegistrationsTable = ({ registrations, onApproveReject, onResend }) => {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = registrations.filter(reg => {
    const q = search.toLowerCase()
    const matchSearch = !q || (reg.full_name || '').toLowerCase().includes(q) || (reg.phone || '').includes(q) || (reg.sid || '').includes(q)
    const matchStatus = filterStatus === 'all' || reg.status === filterStatus
    const matchLevel = filterLevel === 'all' || reg.academic_level === filterLevel
    return matchSearch && matchStatus && matchLevel
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search name, phone, SID..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search" />
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

      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Phone</th><th>SID</th><th>Level</th><th>Stream</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8" style={{ color: 'rgba(238,230,216,0.3)' }}>No records found</td></tr>
            ) : filtered.map((reg, i) => (
              <tr key={reg.id || i} className="cursor-pointer" onClick={() => setSelected(reg)}>
                <td className="font-medium text-white">{reg.full_name}</td>
                <td>{reg.phone}</td>
                <td className="font-mono text-xs">{reg.sid || '—'}</td>
                <td>{reg.academic_level}</td>
                <td>{reg.stream || '—'}</td>
                <td>
                  <span className={`status-badge ${reg.status}`}>{reg.status}</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {reg.status === 'pending' && (
                      <>
                        <button type="button" className="action-btn approve" onClick={e => { e.stopPropagation(); onApproveReject(reg.id, 'approve') }}>Approve</button>
                        <button type="button" className="action-btn reject" onClick={e => { e.stopPropagation(); onApproveReject(reg.id, 'reject') }}>Reject</button>
                      </>
                    )}
                    {reg.status === 'approved' && (
                      <button type="button" className="action-btn resend" onClick={e => { e.stopPropagation(); onResend?.(reg.id) }}>Resend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <ProfileModal registration={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default RegistrationsTable