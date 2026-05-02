const STATUS_MAP = {
  approved: { color: '#34d399', label: 'Approved' },
  rejected: { color: '#fb7185', label: 'Rejected' },
  pending: { color: '#fbbf24', label: 'Pending' }
}

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
    <span className="text-xs uppercase tracking-[0.12em] font-semibold" style={{ color: 'rgba(238,230,216,0.4)' }}>{label}</span>
    <span className="text-sm text-white/90 text-right max-w-[60%] truncate">{value || '—'}</span>
  </div>
)

const ProfileModal = ({ registration, onClose }) => {
  const st = STATUS_MAP[registration.status] || STATUS_MAP.pending

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="admin-card rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white tracking-tight">Attendee Details</h2>
          <span className="status-badge" style={{ background: `${st.color}18`, color: st.color, border: `1px solid ${st.color}40` }}>
            {st.label}
          </span>
        </div>
        <div className="space-y-0">
          <Row label="Name" value={registration.full_name} />
          <Row label="Email" value={registration.email} />
          <Row label="Phone" value={registration.phone} />
          <Row label="SID" value={registration.sid} />
          <Row label="Academic Level" value={registration.academic_level} />
          <Row label="Stream" value={registration.stream} />
          <Row label="College" value={registration.college_name} />
          <Row label="Reg Type" value={registration.reg_type} />
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="admin-button px-5 py-2 text-xs uppercase tracking-[0.1em]">Close</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal