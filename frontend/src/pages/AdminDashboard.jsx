import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MetricCards from '../components/admin/MetricCards'
import RegistrationsTable from '../components/admin/RegistrationsTable'
import OnSpotTable from '../components/admin/OnSpotTable'
import VolunteersTable from '../components/admin/VolunteersTable'
import AttendanceTable from '../components/admin/AttendanceTable'
import CSVImportModal from '../components/admin/CSVImportModal'
import Toast from '../components/shared/Toast'
import collegeLogo from '../assets/images/college-logo.png'

// ─── Tab config ──────────────────────────────────────────────
const TABS = [
  {
    id: 'pre',
    label: 'Pre-Registration',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  },
  {
    id: 'onspot',
    label: 'On-Spot',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  },
  {
    id: 'volunteers',
    label: 'Volunteers',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  },
  {
    id: 'import',
    label: 'Import / Export',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
  },
]

// ─── Per-tab metric card configs ─────────────────────────────
const METRIC_CFGS = {
  pre: [
    { key: 'total_pre_registered', label: 'Total Pre-Reg', color: '#818CF8', dot: '#6366F1', glow: 'rgba(99,102,241,0.15)' },
    { key: 'pending',              label: 'Pending',       color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
    { key: 'approved',             label: 'Approved',      color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'rejected',             label: 'Rejected',      color: '#f87171', dot: '#EF4444', glow: 'rgba(239,68,68,0.15)' },
    { key: 'passes_sent',          label: 'Passes Sent',   color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
  ],
  onspot: [
    { key: 'total_onspot',          label: 'Total On-Spot',   color: '#38bdf8', dot: '#0ea5e9', glow: 'rgba(14,165,233,0.15)' },
    { key: 'onspot_students',       label: 'Students',         color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'onspot_freshers',       label: 'Freshers',         color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
    { key: 'onspot_professionals',  label: 'Professionals',    color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  ],
  volunteers: [
    { key: 'total_volunteers', label: 'Total Volunteers', color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
  ],
  attendance: [
    { key: 'total_validated',       label: 'Total Validated',  color: '#2dd4bf', dot: '#14b8a6', glow: 'rgba(20,184,166,0.15)' },
    { key: 'pre_attended',          label: 'Pre-Reg',           color: '#818CF8', dot: '#6366F1', glow: 'rgba(99,102,241,0.15)' },
    { key: 'onspot_attended',       label: 'On-Spot',           color: '#38bdf8', dot: '#0ea5e9', glow: 'rgba(14,165,233,0.15)' },
    { key: 'students_attended',     label: 'Students',          color: '#34d399', dot: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    { key: 'freshers_attended',     label: 'Freshers',          color: '#a78bfa', dot: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
    { key: 'professionals_attended',label: 'Professionals',     color: '#fbbf24', dot: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  ],
  import: [],
}

// ─── Export helper ────────────────────────────────────────────
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

// ─── Skeleton ─────────────────────────────────────────────────
const Skeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
          <div className="h-2 rounded mb-3 mx-auto w-16" style={{ background: '#1a1a2e' }} />
          <div className="h-7 rounded mx-auto w-12" style={{ background: '#1a1a2e' }} />
        </div>
      ))}
    </div>
    <div className="rounded-xl p-6" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1a1a2e' }} />
        ))}
      </div>
    </div>
  </motion.div>
)

// ─── Main Component ────────────────────────────────────────────
const EMPTY_METRICS = {
  total_pre_registered: 0, total_onspot: 0, approved: 0, attended: 0,
  pending: 0, rejected: 0, passes_sent: 0, total_volunteers: 0,
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

  const showToast = (message, type = 'success') => setToast({ message, type })

  // ── Fetch all data (silent = no full skeleton) ──
  const fetchAll = async (silent = false) => {
    const t = localStorage.getItem('token')
    console.log('Token from localStorage:', t ? 'EXISTS' : 'NULL')
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
        const t2 = localStorage.getItem('token')
        const volRes = await fetch(`${API}/api/admin/volunteers`, {
          headers: { Authorization: `Bearer ${t2}` }
        })
        if (volRes.ok) {
          const vd = await volRes.json()
          volunteersData = vd.data || vd || []
        }
      } catch (e) {
        console.warn('Volunteers fetch failed:', e)
      }

      console.log('Stats response:', stats)
      console.log('Metrics set to:', { ...EMPTY_METRICS, ...stats })
      setMetrics({ ...EMPTY_METRICS, ...stats })
      setRegistrations(preData.data || [])
      setOnSpotRegistrations(onspotData.data || [])
      setAttendance(attendanceData || [])
      setVolunteers(volunteersData)
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // ── Mount: auth check + initial load (runs once) ──
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = () => fetchAll(false)
  const handleSilentRefresh = () => fetchAll(true)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin')
  }

  // ── Build metric cards for active tab ──
  const metricCards = (METRIC_CFGS[activeTab] || []).map(c => ({ ...c, value: metrics[c.key] ?? 0 }))

  return (
    <div className="admin-shell text-white min-h-screen">

      {/* ── Top Bar ── */}
      <header className="admin-topbar">
        <div className="max-w-7xl mx-auto px-5 py-3.5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={collegeLogo} alt="IZee" className="h-10 w-auto" style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.2))' }} />
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] font-semibold" style={{ color: 'rgba(99,102,241,0.6)' }}>IZEE Job Fair 2026</p>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: '#334155' }}>Admin Dashboard</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleRefresh} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] rounded-lg font-medium transition-all duration-200"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {loading ? <Skeleton /> : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Metric Cards (tab-specific) */}
            <MetricCards cards={metricCards} />

            {/* Tab Bar */}
            <div className="flex flex-wrap gap-2 mb-5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`admin-pill px-4 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'pre' && (
                <motion.div key="pre" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="admin-card rounded-xl p-6">
                  <RegistrationsTable
                    registrations={registrations}
                    onRefresh={handleSilentRefresh}
                    onToast={showToast}
                  />
                </motion.div>
              )}

              {activeTab === 'onspot' && (
                <motion.div key="onspot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="admin-card rounded-xl p-6">
                  <OnSpotTable
                    registrations={onSpotRegistrations}
                    onRefresh={handleSilentRefresh}
                    onToast={showToast}
                  />
                </motion.div>
              )}

              {activeTab === 'volunteers' && (
                <motion.div key="volunteers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="admin-card rounded-xl p-6">
                  <VolunteersTable
                    volunteers={volunteers}
                    onRefresh={handleSilentRefresh}
                    onToast={showToast}
                  />
                </motion.div>
              )}

              {activeTab === 'attendance' && (
                <motion.div key="attendance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="admin-card rounded-xl p-6">
                  <AttendanceTable attendances={attendance} />
                </motion.div>
              )}

              {activeTab === 'import' && (
                <motion.div key="import" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="space-y-6">

                    {/* Import */}
                    <div className="admin-card rounded-xl p-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: '#e5c87a' }}>Import</p>
                      <p className="text-sm mb-5" style={{ color: '#64748B' }}>Upload a Google Forms CSV to bulk-import pre-registrations.</p>
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="admin-button gold px-5 py-2.5 text-xs uppercase tracking-[0.12em]"
                      >
                        Choose CSV File
                      </button>
                    </div>

                    {/* Export */}
                    <div className="admin-card rounded-xl p-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: '#818CF8' }}>Export</p>
                      <p className="text-sm mb-5" style={{ color: '#64748B' }}>Download registration data as spreadsheet or CSV.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Excel Pre-Reg', endpoint: '/api/admin/export/pre', filename: 'pre_registrations.zip' },
                          { label: 'Excel On-Spot', endpoint: '/api/admin/export/onspot', filename: 'onspot_registrations.csv' },
                          { label: 'Excel Volunteers', endpoint: '/api/admin/export/volunteers', filename: 'volunteers.csv' },
                          { label: 'CSV Students', endpoint: '/api/admin/export/attendee-type/student', filename: 'students.csv' },
                          { label: 'CSV Freshers', endpoint: '/api/admin/export/attendee-type/fresher', filename: 'freshers.csv' },
                          { label: 'CSV Professionals', endpoint: '/api/admin/export/attendee-type/professional', filename: 'professionals.csv' },
                        ].map(({ label, endpoint, filename }) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => downloadFile(endpoint, filename)}
                            className="admin-button px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-left"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </div>

      {/* ── Modals + Toast ── */}
      <CSVImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={() => { setShowImportModal(false); fetchAll(true) }}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboard
