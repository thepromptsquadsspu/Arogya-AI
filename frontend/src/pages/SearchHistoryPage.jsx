import React, { useState, useEffect } from 'react';
import { History, Search, Calendar, Eye, ShieldCheck, RefreshCw, X } from 'lucide-react';

export default function SearchHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item =>
    item.top_disease.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.primary_urgency.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.symptoms.some(s => s.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Search & Audit Log History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review previous symptom triage checks. All records are 100% anonymized.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter history..."
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading audit history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Triage History Found</h3>
          <p className="text-xs text-slate-400 mt-1">Complete a symptom check to log anonymized audit entries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.primary_urgency === 'Emergency' ? 'bg-red-950/80 border-red-800 text-red-300' :
                    item.primary_urgency === 'Consult GP' ? 'bg-amber-950/80 border-amber-800 text-amber-300' :
                    'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  }`}>
                    {item.primary_urgency === 'Emergency' ? '🔴 Emergency' : item.primary_urgency === 'Consult GP' ? '🟡 Consult GP' : '🟢 Self Care'}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.top_disease}</h3>
                </div>

                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Symptoms:</strong> {item.symptoms.join(', ')}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-center transition"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Inspect</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full relative space-y-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Triage Audit Log #{selectedItem.id}</h3>
            
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div><strong className="text-slate-400">Timestamp:</strong> {selectedItem.timestamp}</div>
              <div><strong className="text-slate-400">Primary Urgency:</strong> {selectedItem.primary_urgency}</div>
              <div><strong className="text-slate-400">Top Predicted Condition:</strong> {selectedItem.top_disease}</div>
              <div><strong className="text-slate-400">Reported Symptoms:</strong> {selectedItem.symptoms.join(', ')}</div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              🔒 Identity Protection Notice: No PII (Name, Email, Phone, IP) was saved with this audit record.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
