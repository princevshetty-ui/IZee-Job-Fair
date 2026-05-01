import { useState } from 'react';

const CSVImportModal = ({ show, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
      onImportSuccess();
    } catch (error) {
      setResult({ error: 'Import failed', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Import Google Forms CSV</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          {result && (
            <div className="p-4 rounded-lg">
              {result.error ? (
                <div className="bg-red-500 text-white p-2 rounded">
                  <strong>Error:</strong> {result.error}
                </div>
              ) : (
                <div className="bg-green-500 text-white p-2 rounded">
                  <strong>Success:</strong> Imported {result.count} records
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90"
            >
              {loading ? 'Importing...' : 'Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CSVImportModal;