import { useState } from 'react';
import ResendConfirmModal from './ResendConfirmModal';

const ExportButtons = () => {
  const [showResendConfirm, setShowResendConfirm] = useState(false);

  const downloadFile = async (endpoint, filename) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button 
        onClick={() => downloadFile('/api/admin/export/all', 'registrations.csv')}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90"
      >
        Export All
      </button>
      <button 
        onClick={() => downloadFile('/api/admin/export/attended', 'attended.csv')}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:opacity-90"
      >
        Export Attended
      </button>
      <button 
        onClick={() => setShowResendConfirm(true)}
        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:opacity-90"
      >
        Resend All Passes
      </button>
      <ResendConfirmModal 
        show={showResendConfirm} 
        onClose={() => setShowResendConfirm(false)}
        onConfirm={async () => {
          await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend-all`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          setShowResendConfirm(false)
        }}
      />
    </div>
  );
};

export default ExportButtons;