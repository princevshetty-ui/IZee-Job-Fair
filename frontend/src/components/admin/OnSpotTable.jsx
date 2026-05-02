import { useState } from 'react'

const OnSpotTable = ({ registrations, onResend }) => {
  const [search, setSearch] = useState('')

  const filtered = registrations.filter(reg => {
    const q = search.toLowerCase()
    return !q || (reg.full_name || '').toLowerCase().includes(q) || (reg.phone || '').includes(q) || (reg.sid || '').includes(q)
  })

  return (
    <div>
      <div className="mb-4 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search name, phone, SID..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search" />
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>SID</th><th>Level</th><th>Stream</th><th>Created At</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8" style={{ color: 'rgba(238,230,216,0.3)' }}>No records found</td></tr>
            ) : filtered.map((reg, i) => (
              <tr key={reg.id || i}>
                <td className="font-medium text-white">{reg.full_name}</td>
                <td>{reg.phone}</td>
                <td className="font-mono text-xs">{reg.sid || '—'}</td>
                <td>{reg.academic_level}</td>
                <td>{reg.stream || '—'}</td>
                <td className="text-xs">{new Date(reg.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                <td>
                  <button type="button" className="action-btn resend" onClick={() => onResend(reg.id)}>Resend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OnSpotTable