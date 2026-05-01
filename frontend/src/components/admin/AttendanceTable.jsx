const AttendanceTable = ({ attendances }) => {
  const formatISTTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">SID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Level</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Stream</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Validated At (IST)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {!attendances || attendances.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendances.map((record, index) => (
                <tr key={record.id || index} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{record.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{record.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-sm">{record.sid || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{record.academic_level || '-'}</td>
                  <td className="px-4 py-3 text-gray-300">{record.stream || '-'}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {record.validated_at ? formatISTTime(record.validated_at) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {attendances && attendances.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          Showing {attendances.length} attendance record{attendances.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;