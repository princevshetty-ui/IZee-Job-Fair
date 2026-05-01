import { useState } from 'react';
import ProfileModal from './ProfileModal';

const RegistrationsTable = ({ registrations, onApproveReject, onResend }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStream, setFilterStream] = useState('all');

  const filtered = registrations.filter(reg => {
    const matchesSearch = 
      (reg.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (reg.phone || '').includes(search) ||
      (reg.sid || '').includes(search);
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    const matchesLevel = filterLevel === 'all' || reg.academic_level === filterLevel;
    const matchesStream = filterStream === 'all' || reg.stream === filterStream;
    return matchesSearch && matchesStatus && matchesLevel && matchesStream;
  });

  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search name, phone, SID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white w-full md:w-auto"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white w-full md:w-auto"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white w-full md:w-auto"
        >
          <option value="all">All Levels</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="Diploma">Diploma</option>
          <option value="ITI">ITI</option>
          <option value="PUC">PUC</option>
          <option value="Graduate">Graduate</option>
        </select>
        <select
          value={filterStream}
          onChange={(e) => setFilterStream(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white w-full md:w-auto"
        >
          <option value="all">All Streams</option>
          <option value="BBA">BBA</option>
          <option value="BCA">BCA</option>
          <option value="BCom">BCom</option>
          <option value="BSc">BSc</option>
          <option value="BA">BA</option>
          <option value="Others">Others</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">SID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Level</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Stream</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan="7">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((reg, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelected(reg)}
                >
                  <td className="px-4 py-2 text-white">{reg.full_name}</td>
                  <td className="px-4 py-2 text-white">{reg.phone}</td>
                  <td className="px-4 py-2 text-white">{reg.sid || '-'}</td>
                  <td className="px-4 py-2 text-white">{reg.academic_level}</td>
                  <td className="px-4 py-2 text-white">{reg.stream || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${reg.status === 'pending' ? 'bg-yellow-500' : 
                        reg.status === 'approved' ? 'bg-green-500' : 
                        'bg-red-500'}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {reg.status === 'pending' && (
                      <>
                        <button 
                          onClick={(event) => {
                            event.stopPropagation()
                            onApproveReject(reg.id, 'approve')
                          }}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={(event) => {
                            event.stopPropagation()
                            onApproveReject(reg.id, 'reject')
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 ml-2"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {reg.status === 'approved' && (
                        <button 
                        onClick={(event) => {
                          event.stopPropagation()
                          onResend?.(reg.id)
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Resend
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <ProfileModal registration={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default RegistrationsTable;