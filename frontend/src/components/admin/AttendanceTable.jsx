const fmt = (dateString) => {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).format(new Date(dateString))
}

const RegTypeBadge = ({ regType }) => {
  const isOnspot = regType === 'onspot'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={isOnspot
        ? { background: 'rgba(6,182,212,0.10)', color: '#22d3ee' }
        : { background: 'rgba(99,102,241,0.10)', color: '#a5b4fc' }
      }>
      {isOnspot ? 'On-Spot' : 'Pre-Reg'}
    </span>
  )
}

const TYPE_LABEL = { student: 'Student', fresher: 'Fresher', professional: 'Professional' }

const AttendanceTable = ({ attendances }) => {
  const rows = attendances || []
  return (
    <div className="space-y-4">
      <div className="text-xs" style={{ color: '#334155' }}>{rows.length} validated attendee{rows.length !== 1 ? 's' : ''}</div>

      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>SID</th><th>Type</th><th>City</th><th>Validated At (IST)</th><th>Reg Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10" style={{ color: 'rgba(238,230,216,0.25)' }}>No attendance records yet</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-white">{r.full_name || '—'}</td>
                <td className="font-mono text-xs">{r.sid || '—'}</td>
                <td className="text-xs" style={{ color: '#94a3b8' }}>{TYPE_LABEL[r.attendee_type] || r.attendee_type || '—'}</td>
                <td>{r.city || '—'}</td>
                <td className="text-xs">{fmt(r.attended_at)}</td>
                <td><RegTypeBadge regType={r.reg_type} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTable
