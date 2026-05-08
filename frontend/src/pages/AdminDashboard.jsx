import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import RegistrationsTable from '../components/admin/RegistrationsTable'
import OnSpotTable from '../components/admin/OnSpotTable'
import VolunteersTable from '../components/admin/VolunteersTable'
import AttendanceTable from '../components/admin/AttendanceTable'
import CSVImportModal from '../components/admin/CSVImportModal'
import Toast from '../components/shared/Toast'
import collegeLogo from '../assets/images/college-logo.png'

const TABS = [
  { id: 'pre', label: 'Pre-Registration', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { id: 'onspot', label: 'On-Spot', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { id: 'volunteers', label: 'Volunteers', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: 'attendance', label: 'Attendance', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { id: 'import', label: 'Import / Export', icon: <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg> },
]

const METRIC_CFGS = {
  pre: [
    { key: 'total_pre_registered', label: 'Total Pre-Reg', color: '#818CF8', dot: '#6366F1', glow: 'rgba(99,102,241,0.15)' },
    { key: 'pending', label: 'Pending', color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
    { key: 'approved', label: 'Approved', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'rejected', label: 'Rejected', color: '#f87171', dot: '#EF4444', glow: 'rgba(239,68,68,0.15)' },
    { key: 'approved', label: 'Passes Sent', color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
  ],
  onspot: [
    { key: 'total_onspot', label: 'Total On-Spot', color: '#38bdf8', dot: '#0ea5e9', glow: 'rgba(14,165,233,0.15)' },
    { key: 'onspot_students', label: 'Students', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'onspot_freshers', label: 'Freshers', color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
    { key: 'onspot_professionals', label: 'Professionals', color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  ],
  volunteers: [
    { key: 'total_volunteers', label: 'Total Volunteers', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
  ],
  attendance: [
    { key: 'total_validated', label: 'Total Validated', color: '#2dd4bf', dot: '#14b8a6', glow: 'rgba(20,184,166,0.15)' },
    { key: 'pre_attended', label: 'Pre-Reg', color: '#818CF8', dot: '#6366F1', glow: 'rgba(99,102,241,0.15)' },
    { key: 'onspot_attended', label: 'On-Spot', color: '#38bdf8', dot: '#0ea5e9', glow: 'rgba(14,165,233,0.15)' },
    { key: 'students_attended', label: 'Students', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'freshers_attended', label: 'Freshers', color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
    { key: 'professionals_attended', label: 'Professionals', color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  ],
  import: [],
}

const downloadFile = async (endpoint, filename) => {
  const API = import.meta.env.VITE_API_URL || ''
  const response = await fetch(`${API}${endpoint}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const EMPTY_METRICS = {
  total_pre_registered: 0, total_onspot: 0, approved: 0, attended: 0,
  pending: 0, rejected: 0, total_volunteers: 0,
  onspot_students: 0, onspot_freshers: 0, onspot_professionals: 0,
  total_validated: 0, pre_attended: 0, onspot_attended: 0,
  students_attended: 0, freshers_attended: 0, professionals_attended: 0,
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pre')
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [onSpotRegistrations, setOnSpotRegistrations] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [metrics, setMetrics] = useState(EMPTY_METRICS)
  const [toast, setToast] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [regOpen, setRegOpen] = useState(true)
  const [onspotOpen, setOnspotOpen] = useState(true)
  const [regModal, setRegModal] = useState(false)
  const [onspotModal, setOnspotModal] = useState(false)
  const [regToggling, setRegToggling] = useState(false)
  const [onspotToggling, setOnspotToggling] = useState(false)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchAll = async (silent = false) => {
    const t = localStorage.getItem('token')
    if (!t) { navigate('/admin'); return }
    if (!silent) setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${t}` }
      const API = import.meta.env.VITE_API_URL || ''
      const [statsRes, preRes, onspotRes, attendanceRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/registrations?reg_type=pre`, { headers }),
        fetch(`${API}/api/admin/registrations?reg_type=onspot`, { headers }),
        fetch(`${API}/api/admin/attendance`, { headers }),
      ])
      if ([statsRes, preRes, onspotRes, attendanceRes].some(r => r.status === 401)) {
        localStorage.removeItem('token')
        navigate('/admin')
        return
      }
      const [stats, preData, onspotData, attendanceData] = await Promise.all([
        statsRes.json(), preRes.json(), onspotRes.json(), attendanceRes.json()
      ])

      let volunteersData = []
      try {
        const volRes = await fetch(`${API}/api/admin/volunteers`, { headers: { Authorization: `Bearer ${t}` } })
        if (volRes.ok) {
          const vd = await volRes.json()
          volunteersData = vd.data || vd || []
        }
      } catch (e) {
        console.warn('Volunteers fetch failed:', e)
      }

      setMetrics({
        total_pre_registered: stats.total_pre_registered || 0,
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        rejected: stats.rejected || 0,
        total_onspot: stats.total_onspot || 0,
        onspot_students: stats.onspot_students || 0,
        onspot_freshers: stats.onspot_freshers || 0,
        onspot_professionals: stats.onspot_professionals || 0,
        total_volunteers: stats.total_volunteers || 0,
        attended: stats.attended || 0,
        total_validated: stats.total_validated || 0,
        pre_attended: stats.pre_attended || 0,
        onspot_attended: stats.onspot_attended || 0,
        students_attended: stats.students_attended || 0,
        freshers_attended: stats.freshers_attended || 0,
        professionals_attended: stats.professionals_attended || 0,
      })
      setRegistrations(preData.data || [])
      setOnSpotRegistrations(onspotData.data || [])
      setAttendance(attendanceData || [])
      setVolunteers(volunteersData)
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchRegStatus = async () => {
    const API = import.meta.env.VITE_API_URL || ''
    try {
      const r = await fetch(`${API}/api/admin/registration-status`)
      if (r.ok) {
        const d = await r.json()
        setRegOpen(d.open)
        setOnspotOpen(d.onspot_open ?? true)
      }
    } catch {}
  }

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) { navigate('/admin'); return }
    try {
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (Date.now() >= payload.exp * 1000) {
        localStorage.removeItem('token')
        navigate('/admin')
        return
      }
    } catch {
      localStorage.removeItem('token')
      navigate('/admin')
      return
    }
    fetchAll(false)
    fetchRegStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = () => fetchAll(true)
  const handleSilentRefresh = () => fetchAll(true)
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/admin') }

  const handleToggleReg = async () => {
    setRegToggling(true)
    const API = import.meta.env.VITE_API_URL || ''
    const t = localStorage.getItem('token')
    try {
      const r = await fetch(`${API}/api/admin/registration-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ open: !regOpen }),
      })
      if (r.ok) {
        const d = await r.json()
        setRegOpen(d.open)
        showToast(`Pre-Registration ${d.open ? 'opened' : 'closed'} successfully`)
      } else {
        showToast('Failed to update registration status', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    } finally {
      setRegToggling(false)
      setRegModal(false)
    }
  }

  const handleToggleOnspot = async () => {
    setOnspotToggling(true)
    const API = import.meta.env.VITE_API_URL || ''
    const t = localStorage.getItem('token')
    try {
      const r = await fetch(`${API}/api/admin/registration-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ onspot_open: !onspotOpen }),
      })
      if (r.ok) {
        const d = await r.json()
        setOnspotOpen(d.onspot_open ?? true)
        showToast(`On-Spot Registration ${d.onspot_open ? 'opened' : 'closed'} successfully`)
      } else {
        showToast('Failed to update on-spot status', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    } finally {
      setOnspotToggling(false)
      setOnspotModal(false)
    }
  }

  const metricCards = (METRIC_CFGS[activeTab] || []).map(c => ({ ...c, value: metrics[c.key] ?? 0 }))

  const RefreshIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
  const LogoutIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  return (
    <div className="admin-shell text-white min-h-screen">

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-full z-40"
        style={{ width: 220, background: '#0A0A0F', borderRight: '1px solid #1a1a2e' }}
      >
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1a1a2e' }}>
          <img src={collegeLogo} alt="IZee" style={{ height: 38, marginBottom: 10, filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))' }} />
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 600, color: 'rgba(99,102,241,0.6)', margin: 0 }}>IZEE Job Fair 2026</p>
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#334155', margin: '3px 0 0' }}>Admin Dashboard</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '11px 17px',
                borderLeft: activeTab === tab.id ? '3px solid #6366F1' : '3px solid transparent',
                background: activeTab === tab.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                color: activeTab === tab.id ? '#e2e8f0' : '#64748B',
                fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer', border: 'none', textAlign: 'left',
                transition: 'all 0.15s ease', outline: 'none',
                borderLeftWidth: 3, borderLeftStyle: 'solid',
                borderLeftColor: activeTab === tab.id ? '#6366F1' : 'transparent',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#64748B' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Registration Status Toggles */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a2e' }}>
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#475569', margin: '0 0 6px', fontWeight: 600 }}>
            Pre-Registration
          </p>
          <button
            onClick={() => setRegModal(true)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all 0.2s', marginBottom: 8,
              background: regOpen ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
              border: regOpen ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.25)',
              color: regOpen ? '#10B981' : '#f87171',
              outline: 'none',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0, display: 'inline-block',
              background: regOpen ? '#10B981' : '#EF4444',
              boxShadow: `0 0 6px ${regOpen ? '#10B981' : '#EF4444'}`,
            }} />
            {regOpen ? 'OPEN' : 'CLOSED'}
          </button>
          <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#475569', margin: '0 0 6px', fontWeight: 600 }}>
            On-Spot
          </p>
          <button
            onClick={() => setOnspotModal(true)}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all 0.2s',
              background: onspotOpen ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
              border: onspotOpen ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.25)',
              color: onspotOpen ? '#10B981' : '#f87171',
              outline: 'none',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0, display: 'inline-block',
              background: onspotOpen ? '#10B981' : '#EF4444',
              boxShadow: `0 0 6px ${onspotOpen ? '#10B981' : '#EF4444'}`,
            }} />
            {onspotOpen ? 'OPEN' : 'CLOSED'}
          </button>
        </div>

        {/* Refresh + Logout */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a2e', display: 'flex', gap: 8 }}>
          <button
            onClick={handleRefresh}
            title="Refresh data"
            style={{
              flex: 1, padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500,
              background: 'rgba(255,255,255,0.03)', border: '1px solid #1a1a2e', borderRadius: 8,
              color: '#64748B', cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = '#1a1a2e' }}
          >
            <RefreshIcon /> Refresh
          </button>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              flex: 1, padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
              color: '#f87171', cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Strip ── */}
      <div
        className="flex md:hidden sticky top-0 z-40 items-center"
        style={{ background: '#0A0A0F', borderBottom: '1px solid #1a1a2e', minHeight: 48 }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            style={{
              flex: 1, padding: '13px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderBottom: activeTab === tab.id ? '2px solid #6366F1' : '2px solid transparent',
              color: activeTab === tab.id ? '#818CF8' : '#475569',
              background: 'transparent', cursor: 'pointer', border: 'none',
              borderBottomWidth: 2, borderBottomStyle: 'solid',
              borderBottomColor: activeTab === tab.id ? '#6366F1' : 'transparent',
              outline: 'none',
            }}
          >
            {tab.icon}
          </button>
        ))}
        <button
          onClick={handleRefresh} title="Refresh"
          style={{ padding: '13px 10px', color: '#475569', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
        >
          <RefreshIcon />
        </button>
        <button
          onClick={handleLogout} title="Logout"
          style={{ padding: '13px 10px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
        >
          <LogoutIcon />
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="md:ml-[220px]">
        <div style={{ padding: '24px 20px', maxWidth: '100%' }}>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {metricCards.length > 0 ? metricCards.map(c => (
              <div
                key={c.label}
                style={{
                  background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: 12,
                  padding: 20, textAlign: 'center', transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.dot, boxShadow: `0 0 6px ${c.dot}`, display: 'inline-block' }} />
                  <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: '#475569', margin: 0 }}>{c.label}</p>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{(c.value || 0).toLocaleString()}</div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', height: 88, background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: 12 }} />
            )}
          </div>

          {/* Tab Content */}
          {loading ? (
            <div style={{ background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: 12, padding: 24 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 40, background: '#1a1a2e', borderRadius: 8, marginBottom: 12, animation: 'pulse 2s infinite' }} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'pre' && (
                <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="admin-card rounded-xl p-6">
                  <RegistrationsTable registrations={registrations} onRefresh={handleSilentRefresh} onToast={showToast} />
                </motion.div>
              )}
              {activeTab === 'onspot' && (
                <motion.div key="onspot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="admin-card rounded-xl p-6">
                  <OnSpotTable registrations={onSpotRegistrations} onRefresh={handleSilentRefresh} onToast={showToast} />
                </motion.div>
              )}
              {activeTab === 'volunteers' && (
                <motion.div key="volunteers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="admin-card rounded-xl p-6">
                  <VolunteersTable volunteers={volunteers} onRefresh={handleSilentRefresh} onToast={showToast} />
                </motion.div>
              )}
              {activeTab === 'attendance' && (
                <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="admin-card rounded-xl p-6">
                  <AttendanceTable attendances={attendance} />
                </motion.div>
              )}
              {activeTab === 'import' && (
                <motion.div key="import" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Import */}
                    <div className="admin-card rounded-xl p-6">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e5c87a', boxShadow: '0 0 6px #e5c87a', display: 'inline-block' }} />
                        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: '#e5c87a', margin: 0 }}>Import</p>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, marginTop: 8 }}>Upload a Google Forms CSV to bulk-import pre-registrations.</p>
                      <button onClick={() => setShowImportModal(true)} className="admin-button gold px-5 py-2.5 text-xs uppercase tracking-[0.12em]">
                        Choose CSV File
                      </button>
                    </div>

                    {/* Excel Exports */}
                    <div className="admin-card rounded-xl p-6">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block' }} />
                        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: '#34d399', margin: 0 }}>Excel Export (.xlsx)</p>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, marginTop: 8 }}>Download formatted spreadsheets. Each file opens directly in Excel / Google Sheets.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
                        {[
                          { label: 'Master Export', sub: 'All sheets + Volunteers', endpoint: '/api/admin/export/excel/master', filename: 'IZee_Job_Fair_2026_Master.xlsx', accent: '#818CF8' },
                          { label: 'Pre-Registrations', sub: 'Students / Freshers / Professionals tabs', endpoint: '/api/admin/export/excel/pre', filename: 'Pre_Registrations.xlsx', accent: '#38bdf8' },
                          { label: 'On-Spot', sub: 'All on-spot registrations', endpoint: '/api/admin/export/excel/onspot', filename: 'OnSpot_Registrations.xlsx', accent: '#34d399' },
                          { label: 'Attendance', sub: 'Only scanned / attended', endpoint: '/api/admin/export/excel/attended', filename: 'Attendance.xlsx', accent: '#2dd4bf' },
                          { label: 'Volunteers', sub: 'All volunteer records', endpoint: '/api/admin/export/excel/volunteers', filename: 'Volunteers.xlsx', accent: '#fbbf24' },
                        ].map(({ label, sub, endpoint, filename, accent }) => (
                          <button
                            key={label} type="button"
                            onClick={() => downloadFile(endpoint, filename)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: `1px solid rgba(${accent === '#818CF8' ? '129,140,248' : accent === '#38bdf8' ? '56,189,248' : accent === '#34d399' ? '52,211,153' : accent === '#2dd4bf' ? '45,212,191' : '251,191,36'},0.2)`,
                              borderRadius: 10, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                              </svg>
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                              <span style={{ marginLeft: 'auto', fontSize: 9, background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>XLSX</span>
                            </div>
                            <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>{sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CSV Exports */}
                    <div className="admin-card rounded-xl p-6">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8', boxShadow: '0 0 6px #818CF8', display: 'inline-block' }} />
                        <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, color: '#818CF8', margin: 0 }}>CSV Export (.csv)</p>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, marginTop: 8 }}>Lightweight flat-file exports for scripting, analysis, or backup.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                        {[
                          { label: 'All Registrations', endpoint: '/api/admin/export/all', filename: 'all_registrations.csv' },
                          { label: 'Pre-Registered', endpoint: '/api/admin/export/pre', filename: 'pre_registrations.zip' },
                          { label: 'On-Spot', endpoint: '/api/admin/export/onspot', filename: 'onspot_registrations.csv' },
                          { label: 'Attended', endpoint: '/api/admin/export/attended', filename: 'attended.csv' },
                          { label: 'Students', endpoint: '/api/admin/export/attendee-type/student', filename: 'students.csv' },
                          { label: 'Freshers', endpoint: '/api/admin/export/attendee-type/fresher', filename: 'freshers.csv' },
                          { label: 'Professionals', endpoint: '/api/admin/export/attendee-type/professional', filename: 'professionals.csv' },
                          { label: 'Volunteers', endpoint: '/api/admin/export/volunteers', filename: 'volunteers.csv' },
                        ].map(({ label, endpoint, filename }) => (
                          <button
                            key={label} type="button"
                            onClick={() => downloadFile(endpoint, filename)}
                            style={{
                              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(129,140,248,0.15)',
                              borderRadius: 8, padding: '10px 14px', textAlign: 'left', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.06)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.15)' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span style={{ fontSize: 11, color: '#CBD5E1', fontWeight: 500 }}>{label}</span>
                            <span style={{ marginLeft: 'auto', fontSize: 9, background: 'rgba(129,140,248,0.1)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 3, padding: '1px 5px', fontWeight: 600 }}>CSV</span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Registration Toggle Confirmation Modal ── */}
      {regModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: 16, padding: 28, maxWidth: 380, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: regOpen ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: regOpen ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(16,185,129,0.25)' }}>
                <svg className="w-5 h-5" style={{ color: regOpen ? '#f87171' : '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={regOpen ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' : 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'} />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: 0 }}>
                  {regOpen ? 'Close Registration?' : 'Open Registration?'}
                </p>
                <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>This affects the public registration page.</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
              {regOpen
                ? 'Closing registration will show a "Registration is currently closed" message to anyone visiting the register page.'
                : 'Opening registration will allow new attendees to submit their pre-registration form.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setRegModal(false)}
                disabled={regToggling}
                style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a2e', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', outline: 'none' }}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleReg}
                disabled={regToggling}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em', cursor: regToggling ? 'not-allowed' : 'pointer', outline: 'none',
                  opacity: regToggling ? 0.6 : 1, transition: 'all 0.2s',
                  background: regOpen ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                  border: regOpen ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)',
                  color: regOpen ? '#f87171' : '#10B981',
                }}
              >
                {regToggling ? 'Saving…' : regOpen ? 'Close It' : 'Open It'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── On-Spot Toggle Confirmation Modal ── */}
      {onspotModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: 16, padding: 28, maxWidth: 380, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: onspotOpen ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: onspotOpen ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(16,185,129,0.25)' }}>
                <svg className="w-5 h-5" style={{ color: onspotOpen ? '#f87171' : '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={onspotOpen ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' : 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'} />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: 0 }}>
                  {onspotOpen ? 'Close On-Spot Registration?' : 'Open On-Spot Registration?'}
                </p>
                <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>This affects the on-spot walk-in page.</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
              {onspotOpen
                ? 'Closing will show a "Registration Closed" message on the on-spot walk-in page.'
                : 'Opening will allow walk-in attendees to register on-spot.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setOnspotModal(false)} disabled={onspotToggling}
                style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid #1a1a2e', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', outline: 'none' }}>
                Cancel
              </button>
              <button onClick={handleToggleOnspot} disabled={onspotToggling}
                style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: onspotToggling ? 'not-allowed' : 'pointer', outline: 'none', opacity: onspotToggling ? 0.6 : 1, transition: 'all 0.2s', background: onspotOpen ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border: onspotOpen ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)', color: onspotOpen ? '#f87171' : '#10B981' }}>
                {onspotToggling ? 'Saving…' : onspotOpen ? 'Close It' : 'Open It'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CSVImportModal show={showImportModal} onClose={() => setShowImportModal(false)} onImportSuccess={() => { setShowImportModal(false); fetchAll(true) }} />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminDashboard
