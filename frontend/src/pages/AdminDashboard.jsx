import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import MetricCards from '../components/admin/MetricCards';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import OnSpotTable from '../components/admin/OnSpotTable';
import AttendanceTable from '../components/admin/AttendanceTable';
import ExportButtons from '../components/admin/ExportButtons';
import CSVImportModal from '../components/admin/CSVImportModal';
import Navbar from '../components/shared/Navbar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pre');
  const [showImportModal, setShowImportModal] = useState(false);
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [onSpotRegistrations, setOnSpotRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [metrics, setMetrics] = useState({
    pre: 0,
    onspot: 0,
    approved: 0,
    attended: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics
        const metricsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/metrics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
        
        // Fetch pre-registrations
        const preRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations?reg_type=pre`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const preData = await preRes.json();
        setRegistrations(preData);
        
        // Fetch on-spot registrations
        const onspotRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations?reg_type=onspot`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const onspotData = await onspotRes.json();
        setOnSpotRegistrations(onspotData);
        
        // Fetch attendance
        const attendanceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/attendance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [token]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <ExportButtons />
        </div>
        
        <MetricCards metrics={metrics} />
        
        <div className="mt-6">
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => handleTabChange('pre')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'pre' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'border border-gray-600 bg-gray-800 text-white'}`}
            >
              Pre-Register
            </button>
            <button 
              onClick={() => handleTabChange('onspot')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'onspot' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'border border-gray-600 bg-gray-800 text-white'}`}
            >
              On-Spot Register
            </button>
            <button 
              onClick={() => handleTabChange('attendance')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'attendance' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'border border-gray-600 bg-gray-800 text-white'}`}
            >
              Attendance
            </button>
            <button 
              onClick={() => handleTabChange('import')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'import' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'border border-gray-600 bg-gray-800 text-white'}`}
            >
              Import
            </button>
          </div>
          
          {activeTab === 'pre' && (
            <RegistrationsTable 
              registrations={registrations} 
              onApproveReject={async (id, action) => {
                // Handle approve/reject logic
                await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations/${id}/${action}`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                // Refetch data
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations?reg_type=pre`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setRegistrations(data);
              }}
            />
          )}
          
          {activeTab === 'onspot' && (
            <OnSpotTable 
              registrations={onSpotRegistrations} 
              onResend={async (id) => {
                // Handle resend logic
                await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend/${id}`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
              }}
            />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceTable attendances={attendance} />
          )}
          
          {activeTab === 'import' && (
            <>
              <button 
                onClick={() => setShowImportModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg"
              >
                Import CSV
              </button>
              <CSVImportModal 
                show={showImportModal} 
                onClose={() => setShowImportModal(false)}
                onImportSuccess={() => {
                  // Refetch data after import
                  const fetchData = async () => {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations?reg_type=pre`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setRegistrations(data);
                  };
                  fetchData();
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;