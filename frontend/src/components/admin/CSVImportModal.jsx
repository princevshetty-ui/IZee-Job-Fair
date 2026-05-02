import { useState } from 'react';

const CSVImportModal = ({ show, onClose, onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
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
      if (!data.error && !data.errors?.length) {
        onImportSuccess();
      }
    } catch (error) {
      setResult({ error: 'Import failed', details: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-light text-white mb-2 font-heading-art tracking-tight">Import Google Forms CSV</h2>
        <p className="text-slate-400 text-sm mb-6">Upload a CSV file exported from Google Forms to bulk-import registrations</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-input"
            />
          </div>

          {result && (
            <div className="space-y-3">
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 font-medium mb-1">Import Failed</p>
                  <p className="text-red-300 text-sm">{result.error}</p>
                  {result.details && <p className="text-red-300/70 text-xs mt-1">{result.details}</p>}
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <p className="text-emerald-400 font-medium mb-1">Import Complete</p>
                  <p className="text-emerald-300 text-sm">
                    Successfully imported <strong>{result.count}</strong> record{result.count !== 1 ? 's' : ''}.
                    {result.skipped > 0 && ` ${result.skipped} row${result.skipped !== 1 ? 's' : ''} skipped.`}
                  </p>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <p className="text-amber-400 font-medium text-sm mb-2">Error Details</p>
                  <ul className="space-y-1.5">
                    {result.errors.map((err, i) => (
                      <li key={i} className="text-amber-300 text-xs leading-relaxed flex gap-2">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
                        <span>{err.row && `Row ${err.row}: `}{err.message || err}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-indigo-500/30 text-slate-300 hover:bg-white/[0.04] transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-60"
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