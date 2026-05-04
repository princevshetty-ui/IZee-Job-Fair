import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { apiCall } from '../utils/api';
import MetricCards from '../components/admin/MetricCards';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import OnSpotTable from '../components/admin/OnSpotTable';
import AttendanceTable from '../components/admin/AttendanceTable';
import CSVImportModal from '../components/admin/CSVImportModal';
import collegeLogo from '../assets/images/college-logo.png';

const TAB_ICONS = {
  pre: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  onspot: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  attendance: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  import: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pre');
  const [showImportModal, setShowImportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [onSpotRegistrations, setOnSpotRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [metrics, setMetrics] = useState({
    total_pre_registered: 0,
    total_onspot: 0,
    approved: 0,
    attended: 0,
    pending: 0,
    rejected: 0
  });

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
        clearAuth()
        navigate('/admin')
        return
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
    if (!isAuthenticated()) {
      navigate('/admin')
      return
    }
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
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleResendAll = async () => {
    await apiCall('/api/admin/resend-all', { method: 'POST' })
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/admin')
  }

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
            <button onClick={fetchData} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <button onClick={() => downloadFile('/api/admin/export/pre', 'pre_registrations.zip')} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Export Pre
            </button>
            <button onClick={() => downloadFile('/api/admin/export/onspot', 'onspot_registrations.csv')} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Export On-Spot
            </button>
            <button onClick={() => downloadFile('/api/admin/export/all', 'all_registrations.csv')} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Export All
            </button>
            <button onClick={() => downloadFile('/api/admin/export/attended', 'attended.csv')} className="admin-button px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Attended
            </button>
            <button onClick={() => setShowImportModal(true)} className="admin-button gold px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Import CSV
            </button>
            <button onClick={handleResendAll} className="admin-button gold px-3.5 py-2 text-[11px] uppercase tracking-[0.1em]">
              Resend All
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] rounded-lg font-medium transition-all duration-200"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
                  <div className="h-2 rounded mb-3 mx-auto w-16" style={{ background: '#1a1a2e' }} />
                  <div className="h-7 rounded mx-auto w-12" style={{ background: '#1a1a2e' }} />
                </div>
              ))}
            </div>
            <div className="rounded-xl p-6" style={{ background: '#0D0D1A', border: '1px solid #1a1a2e' }}>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1a1a2e' }} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <MetricCards metrics={metrics} />

            <div className="mt-6">
              {/* Tab Bar */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { id: 'pre', label: 'Pre-Registered' },
                  { id: 'onspot', label: 'On-Spot' },
                  { id: 'attendance', label: 'Attendance' },
                  { id: 'import', label: 'Import' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`admin-pill px-4 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    {TAB_ICONS[tab.id]}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'pre' && (
                <motion.div key="pre" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className="admin-card rounded-xl p-6">
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
                </motion.div>
              )}

              {activeTab === 'onspot' && (
                <motion.div key="onspot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className="admin-card rounded-xl p-6">
                  <OnSpotTable
                    registrations={onSpotRegistrations}
                    onResend={async (id) => {
                      await apiCall(`/api/admin/resend/${id}`, { method: 'POST' });
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'attendance' && (
                <motion.div key="attendance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className="admin-card rounded-xl p-6">
                  <AttendanceTable attendances={attendance} />
                </motion.div>
              )}

              {activeTab === 'import' && (
                <motion.div key="import" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className="admin-card gold rounded-xl p-8">
                  <div className="max-w-md">
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: '#e5c87a' }}>CSV Import</p>
                    <p className="text-sm mb-5" style={{ color: '#64748B' }}>Upload a Google Forms CSV to import approved registrations.</p>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="admin-button gold px-5 py-2.5 text-xs uppercase tracking-[0.12em]"
                    >
                      Choose CSV File
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <CSVImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={() => { fetchData() }}
      />
    </div>
  );
};

export default AdminDashboard;
