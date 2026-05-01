import { useState } from 'react';

const OnSpotTable = ({ registrations, onResend }) => {
  const [search, setSearch] = useState('');

  const filtered = registrations.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) ||
    reg.phone.includes(search) ||
    reg.sid.includes(search)
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search name, phone, SID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white"
        />
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
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Created At</th>
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
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2 text-white">{reg.name}</td>
                  <td className="px-4 py-2 text-white">{reg.phone}</td>
                  <td className="px-4 py-2 text-white">{reg.sid}</td>
                  <td className="px-4 py-2 text-white">{reg.academic_level}</td>
                  <td className="px-4 py-2 text-white">{reg.stream}</td>
                  <td className="px-4 py-2 text-white">{new Date(reg.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => onResend(reg.id)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Resend
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnSpotTable;