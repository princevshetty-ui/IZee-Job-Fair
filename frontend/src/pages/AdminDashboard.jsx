import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MetricCards from '../components/admin/MetricCards'
import RegistrationsTable from '../components/admin/RegistrationsTable'
import OnSpotTable from '../components/admin/OnSpotTable'
import VolunteersTable from '../components/admin/VolunteersTable'
import AttendanceTable from '../components/admin/AttendanceTable'
import CSVImportModal from '../components/admin/CSVImportModal'
import Toast from '../components/shared/Toast'
import collegeLogo from '../assets/images/college-logo.png'

const TABS = [
  { id: 'pre', label: 'Pre-Registration', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  { id: 'onspot', label: 'On-Spot', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { id: 'volunteers', label: 'Volunteers', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: 'attendance', label: 'Attendance', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { id: 'import', label: 'Import / Export', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg> },
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

  const handleRefresh = () => fetchAll(true)
  const handleSilentRefresh = () => fetchAll(true)
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/admin') }

  const metricCards = (METRIC_CFGS[activeTab] || []).map(c => ({ ...c, value: metrics[c.key] ?? 0 }))

  return (
    <div className="admin-shell text-white min-h-screen">
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
            <button onClick={handleLogout} className="px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] rounded-lg font-medium transition-all duration-200" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* Tab Bar — always visible, no animation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                borderRadius: '999px',
                border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid #1a1a2e',
                background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? 'white' : '#94A3B8',
                padding: '8px 16px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 0 16px rgba(99,102,241,0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Metric Cards — always visible, no animation wrapper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {metricCards.length > 0 ? metricCards.map(c => (
            <div
              key={c.label}
              style={{
                background: '#0D0D1A',
                border: '1px solid #1a1a2e',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.dot, boxShadow: `0 0 6px ${c.dot}`, display: 'inline-block' }} />
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: '600', color: '#475569', margin: 0 }}>{c.label}</p>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: c.color }}>{(c.value || 0).toLocaleString()}</div>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', height: '88px', background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: '12px' }} />
          )}
        </div>

        {/* Loading or Content */}
        {loading ? (
          <div style={{ background: '#0D0D1A', border: '1px solid #1a1a2e', borderRadius: '12px', padding: '24px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: '40px', background: '#1a1a2e', borderRadius: '8px', marginBottom: '12px', animation: 'pulse 2s infinite' }} />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Import */}
                  <div className="admin-card rounded-xl p-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e5c87a', boxShadow: '0 0 6px #e5c87a', display: 'inline-block' }} />
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '600', color: '#e5c87a', margin: 0 }}>Import</p>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', marginTop: '8px' }}>Upload a Google Forms CSV to bulk-import pre-registrations.</p>
                    <button onClick={() => setShowImportModal(true)} className="admin-button gold px-5 py-2.5 text-xs uppercase tracking-[0.12em]">
                      Choose CSV File
                    </button>
                  </div>

                  {/* Excel Exports */}
                  <div className="admin-card rounded-xl p-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', display: 'inline-block' }} />
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '600', color: '#34d399', margin: 0 }}>Excel Export (.xlsx)</p>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', marginTop: '8px' }}>Download formatted spreadsheets. Each file opens directly in Excel / Google Sheets.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
                      {[
                        { label: 'Master Export', sub: 'All sheets + Volunteers', endpoint: '/api/admin/export/excel/master', filename: 'IZee_Job_Fair_2026_Master.xlsx', accent: '#818CF8' },
                        { label: 'Pre-Registrations', sub: 'Students / Freshers / Professionals tabs', endpoint: '/api/admin/export/excel/pre', filename: 'Pre_Registrations.xlsx', accent: '#38bdf8' },
                        { label: 'On-Spot', sub: 'All on-spot registrations', endpoint: '/api/admin/export/excel/onspot', filename: 'OnSpot_Registrations.xlsx', accent: '#34d399' },
                        { label: 'Attendance', sub: 'Only scanned / attended', endpoint: '/api/admin/export/excel/attended', filename: 'Attendance.xlsx', accent: '#2dd4bf' },
                        { label: 'Volunteers', sub: 'All volunteer records', endpoint: '/api/admin/export/excel/volunteers', filename: 'Volunteers.xlsx', accent: '#fbbf24' },
                      ].map(({ label, sub, endpoint, filename, accent }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => downloadFile(endpoint, filename)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: `1px solid rgba(${accent === '#818CF8' ? '129,140,248' : accent === '#38bdf8' ? '56,189,248' : accent === '#34d399' ? '52,211,153' : accent === '#2dd4bf' ? '45,212,191' : '251,191,36'},0.2)`,
                            borderRadius: '10px',
                            padding: '14px 16px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                            <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '4px', padding: '1px 6px', fontWeight: '600' }}>XLSX</span>
                          </div>
                          <p style={{ fontSize: '10px', color: '#475569', margin: 0 }}>{sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CSV Exports */}
                  <div className="admin-card rounded-xl p-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818CF8', boxShadow: '0 0 6px #818CF8', display: 'inline-block' }} />
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '600', color: '#818CF8', margin: 0 }}>CSV Export (.csv)</p>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', marginTop: '8px' }}>Lightweight flat-file exports for scripting, analysis, or backup.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
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
                          key={label}
                          type="button"
                          onClick={() => downloadFile(endpoint, filename)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(129,140,248,0.15)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.06)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.15)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          <span style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: '500' }}>{label}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(129,140,248,0.1)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '3px', padding: '1px 5px', fontWeight: '600' }}>CSV</span>
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

      <CSVImportModal show={showImportModal} onClose={() => setShowImportModal(false)} onImportSuccess={() => { setShowImportModal(false); fetchAll(true) }} />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default AdminDashboard