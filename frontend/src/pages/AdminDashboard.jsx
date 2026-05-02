import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MetricCards from '../components/admin/MetricCards';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import OnSpotTable from '../components/admin/OnSpotTable';
import AttendanceTable from '../components/admin/AttendanceTable';
import CSVImportModal from '../components/admin/CSVImportModal';
import collegeLogo from '../assets/images/college-logo.png';

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

      // Handle 401
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
    const timer = setTimeout(() => {
      fetchData()
    }, 0)
    return () => clearTimeout(timer)
  }, [token, isAuthenticated, navigate, fetchData])

  const downloadFile = async (endpoint, filename) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
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
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  return (
    <div className="admin-shell text-white">
      <header className="admin-topbar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={collegeLogo}
              alt="IZee"
              className="h-12 w-auto"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#BEA35D]/90">IZEE Job Fair</p>
              <p className="text-xs uppercase tracking-[0.14em] text-white/50">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={fetchData} className="admin-button px-4 py-2 text-xs uppercase tracking-[0.12em]">
              Refresh
            </button>
            <button
              onClick={() => downloadFile('/api/admin/export/pre', 'pre_registrations.zip')}
              className="admin-button px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Export Pre-Register
            </button>
            <button
              onClick={() => downloadFile('/api/admin/export/onspot', 'onspot_registrations.csv')}
              className="admin-button px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Export On-Spot
            </button>
            <button
              onClick={() => downloadFile('/api/admin/export/all', 'all_registrations.csv')}
              className="admin-button px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Export All
            </button>
            <button
              onClick={() => downloadFile('/api/admin/export/attended', 'attended.csv')}
              className="admin-button px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Export Attended
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="admin-button gold px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Import CSV
            </button>
            <button
              onClick={handleResendAll}
              className="admin-button gold px-4 py-2 text-xs uppercase tracking-[0.12em]"
            >
              Resend All
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="admin-card rounded-xl p-5 animate-pulse">
                  <div className="h-3 bg-white/5 rounded mb-3 mx-auto w-16" />
                  <div className="h-8 bg-white/5 rounded mx-auto w-20" />
                </div>
              ))}
            </div>
            <div className="admin-card p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-white/[0.03] rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <MetricCards metrics={metrics} />

            <div className="mt-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('pre')}
                  className={`admin-pill px-4 py-2 text-xs uppercase tracking-[0.12em] ${activeTab === 'pre' ? 'active' : ''}`}
                >
                  Pre-Registered
                </button>
                <button
                  onClick={() => setActiveTab('onspot')}
                  className={`admin-pill px-4 py-2 text-xs uppercase tracking-[0.12em] ${activeTab === 'onspot' ? 'active' : ''}`}
                >
                  On-Spot
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`admin-pill px-4 py-2 text-xs uppercase tracking-[0.12em] ${activeTab === 'attendance' ? 'active' : ''}`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab('import')}
                  className={`admin-pill px-4 py-2 text-xs uppercase tracking-[0.12em] ${activeTab === 'import' ? 'active' : ''}`}
                >
                  Import
                </button>
              </div>

              {activeTab === 'pre' && (
                <div className="admin-card p-6">
                  <RegistrationsTable
                    registrations={registrations}
                    onApproveReject={async (id, action) => {
                      const endpoint = action === 'approve'
                        ? `/api/admin/approve/${id}`
                        : `/api/admin/reject/${id}`
                      await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                      })
                      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations?reg_type=pre`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                      })
                      const data = await res.json()
                      setRegistrations(data.data || [])
                    }}
                    onResend={async (id) => {
                      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend/${id}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      })
                    }}
                  />
                </div>
              )}

              {activeTab === 'onspot' && (
                <div className="admin-card p-6">
                  <OnSpotTable
                    registrations={onSpotRegistrations}
                    onResend={async (id) => {
                      await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend/${id}`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                    }}
                  />
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="admin-card p-6">
                  <AttendanceTable attendances={attendance} />
                </div>
              )}

              {activeTab === 'import' && (
                <div className="admin-card gold p-6">
                  <p className="text-sm text-white/70 mb-4">Upload a Google Forms CSV to import approved registrations.</p>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="admin-button gold px-4 py-2 text-xs uppercase tracking-[0.12em]"
                  >
                    Choose CSV File
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CSVImportModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={() => {
          fetchData()
        }}
      />
    </div>
  );
};

export default AdminDashboard;