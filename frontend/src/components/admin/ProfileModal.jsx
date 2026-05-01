import { useState } from 'react';

const ProfileModal = ({ registration, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Attendee Details</h2>
        <div className="space-y-4">
          <p><strong className="text-gray-300">Name:</strong> <span className="text-white">{registration.full_name}</span></p>
          <p><strong className="text-gray-300">Email:</strong> <span className="text-white">{registration.email}</span></p>
          <p><strong className="text-gray-300">Phone:</strong> <span className="text-white">{registration.phone}</span></p>
          <p><strong className="text-gray-300">SID:</strong> <span className="text-white">{registration.sid}</span></p>
          <p><strong className="text-gray-300">Academic Level:</strong> <span className="text-white">{registration.academic_level}</span></p>
          <p><strong className="text-gray-300">Stream:</strong> <span className="text-white">{registration.stream}</span></p>
          <p><strong className="text-gray-300">Status:</strong> <span className={`text-${registration.status === 'approved' ? 'green' : registration.status === 'rejected' ? 'red' : 'yellow'}-500`}>{registration.status}</span></p>
          <p><strong className="text-gray-300">Registration Type:</strong> <span className="text-white">{registration.reg_type}</span></p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;