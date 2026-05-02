const AttendanceTable = ({ attendances }) => {
  const fmt = (dateString) => {
    if (!dateString) return '—'
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(new Date(dateString))
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>SID</th><th>Level</th><th>Stream</th><th>Validated At (IST)</th></tr>
          </thead>
          <tbody>
            {!attendances || attendances.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8" style={{ color: 'rgba(238,230,216,0.3)' }}>No attendance records found</td></tr>
            ) : attendances.map((r, i) => (
              <tr key={r.id || i}>
                <td className="font-medium text-white">{r.full_name || '—'}</td>
                <td>{r.phone || '—'}</td>
                <td className="font-mono text-xs">{r.sid || '—'}</td>
                <td>{r.academic_level || '—'}</td>
                <td>{r.stream || '—'}</td>
                <td className="text-xs">{fmt(r.attended_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {attendances && attendances.length > 0 && (
        <div className="mt-4 text-xs" style={{ color: 'rgba(238,230,216,0.35)' }}>
          Showing {attendances.length} record{attendances.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default AttendanceTable