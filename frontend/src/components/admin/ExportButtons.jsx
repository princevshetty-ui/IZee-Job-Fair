import { useState } from 'react';
import ResendConfirmModal from './ResendConfirmModal';

const ExportButtons = () => {
  const [showResendConfirm, setShowResendConfirm] = useState(false);

  return (
    <div className="flex space-x-4">
      <button 
        onClick={() => {}}
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:opacity-90"
      >
        Export Pre-Registered
      </button>
      <button 
        onClick={() => {}}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90"
      >
        Export On-Spot
      </button>
      <button 
        onClick={() => {}}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90"
      >
        Export Attendance
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
        onConfirm={() => {
          // Handle resend all logic
          setShowResendConfirm(false);
        }}
      />
    </div>
  );
};

export default ExportButtons;