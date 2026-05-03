import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { apiCall } from '../utils/api'
import MetricCards from '../components/admin/MetricCards'
import RegistrationsTable from '../components/admin/RegistrationsTable'
import OnSpotTable from '../components/admin/OnSpotTable'
import AttendanceTable from '../components/admin/AttendanceTable'
import CSVImportModal from '../components/admin/CSVImportModal'
import ResendConfirmModal from '../components/admin/ResendConfirmModal'
import collegeLogo from '../assets/images/college-logo.png'

const NAV = [
  { id: 'pre', label: 'Pre-Registered', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )},
  { id: 'onspot', label: 'On-Spot', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
    </svg>
  )},
  { id: 'attendance', label: 'Attendance', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
  { id: 'import', label: 'Import CSV', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )},
]

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pre')
  const [showImportModal, setShowImportModal] = useState(false)
  const [showResendAll, setShowResendAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const { token, isAuthenticated, clearAuth } = useAuth()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [onSpotRegistrations, setOnSpotRegistrations] = useState([])
  const [attendance, setAttendance] = useState([])
  const [metrics, setMetrics] = useState({
    total_pre_registered: 0, total_onspot: 0,
    approved: 0, attended: 0, pending: 0, rejected: 0
  })

  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const API = import.meta.env.VITE_API_URL || ''

      const [metricsRes, preRes, onspotRes, attendanceRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/registrations?reg_type=pre`, { headers }),
        fetch(`${API}/api/admin/registrations?reg_type=onspot`, { headers }),
        fetch(`${API}/api/admin/attendance`, { headers })
      ])

      if ([metricsRes, preRes, onspotRes, attendanceRes].some(r => r.status === 401)) {
        clearAuth(); navigate('/admin'); return
      }

      const [metricsData, preData, onspotData, attendanceData] = await Promise.all([
        metricsRes.json(), preRes.json(), onspotRes.json(), attendanceRes.json()
      ])

      setMetrics(metricsData)
      setRegistrations(preData.data || [])
      setOnSpotRegistrations(onspotData.data || [])
      setAttendance(attendanceData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [token, clearAuth, navigate])

  useEffect(() => {
    if (!isAuthenticated()) { navigate('/admin'); return }
    const timer = setTimeout(() => { fetchData() }, 0)
    return () => clearTimeout(timer)
  }, [token, isAuthenticated, navigate, fetchData])

  const downloadFile = async (endpoint, filename) => {
    const API_URL = import.meta.env.VITE_API_URL || ''
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = filename; link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="admin-shell text-white min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="admin-topbar">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={collegeLogo} alt="IZee" className="h-10 w-auto flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#BEA35D]/80 truncate">IZEE Job Fair 2026</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35 truncate">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button onClick={fetchData} className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">↻ Refresh</button>
            <button onClick={() => downloadFile('/api/admin/export/pre', 'pre_registrations.zip')} className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Export Pre</button>
            <button onClick={() => downloadFile('/api/admin/export/onspot', 'onspot.csv')} className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Export On-Spot</button>
            <button onClick={() => downloadFile('/api/admin/export/all', 'all.csv')} className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Export All</button>
            <button onClick={() => downloadFile('/api/admin/export/attended', 'attended.csv')} className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Export Attended</button>
            <button onClick={() => setShowImportModal(true)} className="admin-button gold px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Import CSV</button>
            <button onClick={() => setShowResendAll(true)} className="admin-button gold px-3 py-1.5 text-[11px] uppercase tracking-[0.1em]">Resend All</button>
            <button
              onClick={() => { clearAuth(); navigate('/admin') }}
              className="admin-button px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-red-400/70 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-4 lg:px-6 py-6 gap-6">

        {/* Sidebar — hidden on small screens, visible lg+ */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 px-3 mb-2">Navigation</p>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${
                activeTab === item.id
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span className={activeTab === item.id ? 'text-blue-400' : 'text-white/30'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Mobile tab strip */}
        <div className="lg:hidden w-full mb-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === item.id
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'border border-white/[0.08] text-white/40 hover:text-white/70 bg-white/[0.02]'
                }`}
              >
                <span className={activeTab === item.id ? 'text-blue-400' : 'text-white/30'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="admin-card rounded-xl p-5 animate-pulse">
                    <div className="h-3 bg-white/5 rounded mb-3 mx-auto w-14" />
                    <div className="h-8 bg-white/5 rounded mx-auto w-16" />
                  </div>
                ))}
              </div>
              <div className="admin-card p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 bg-white/[0.03] rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <MetricCards metrics={metrics} />

              {/* Mobile tabs row */}
              <div className="lg:hidden -mt-2">
                {/* already rendered above the main tag for small screens but we use a wrapping div trick */}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  {activeTab === 'pre' && (
                    <div className="admin-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Pre-Registered</h2>
                        <span className="text-xs text-white/30">{registrations.length} records</span>
                      </div>
                      <RegistrationsTable
                        registrations={registrations}
                        onApproveReject={async (id, action) => {
                          const endpoint = action === 'approve' ? `/api/admin/approve/${id}` : `/api/admin/reject/${id}`
                          await apiCall(endpoint, { method: 'PUT' })
                          const res = await apiCall('/api/admin/registrations?reg_type=pre')
                          const data = await res.json()
                          setRegistrations(data.data || [])
                        }}
                        onResend={async (id) => {
                          await apiCall(`/api/admin/resend/${id}`, { method: 'POST' })
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'onspot' && (
                    <div className="admin-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">On-Spot Registrations</h2>
                        <span className="text-xs text-white/30">{onSpotRegistrations.length} records</span>
                      </div>
                      <OnSpotTable
                        registrations={onSpotRegistrations}
                        onResend={async (id) => {
                          await apiCall(`/api/admin/resend/${id}`, { method: 'POST' })
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'attendance' && (
                    <div className="admin-card p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Attendance Log</h2>
                        <span className="text-xs text-white/30">{attendance.length} checked in</span>
                      </div>
                      <AttendanceTable attendances={attendance} />
                    </div>
                  )}

                  {activeTab === 'import' && (
                    <div className="admin-card gold p-6">
                      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Import Google Forms CSV</h2>
                      <p className="text-sm text-white/50 mb-5 leading-relaxed">Upload a Google Forms CSV export to bulk-import approved registrations into the system.</p>
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="admin-button gold px-5 py-2.5 text-xs uppercase tracking-[0.12em]"
                      >
                        Choose CSV File
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </main>
      </div>

      <CSVImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={fetchData}
      />

      <ResendConfirmModal
        show={showResendAll}
        onClose={() => setShowResendAll(false)}
        onConfirm={async () => {
          await apiCall('/api/admin/resend-all', { method: 'POST' })
          setShowResendAll(false)
        }}
      />
    </div>
  )
}

export default AdminDashboard
