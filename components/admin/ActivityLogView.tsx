import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Sparkles, 
  Upload, 
  Archive, 
  RefreshCw, 
  Clock 
} from 'lucide-react';
import { AdminActivityLog } from '../../types.ts';
import { JobService } from '../../services/jobService.ts';

export const ActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const list = JobService.getActivityLogs();
    setLogs(list);
  };

  const getActionBadge = (action: AdminActivityLog['action']) => {
    switch (action) {
      case 'created':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><PlusCircle size={10} /> Created</span>;
      case 'updated':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><Edit3 size={10} /> Updated</span>;
      case 'published':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={10} /> Published</span>;
      case 'unpublished':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Unpublished</span>;
      case 'featured':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200"><Sparkles size={10} /> Featured</span>;
      case 'archived':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Archive size={10} /> Archived</span>;
      case 'deleted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><Trash2 size={10} /> Deleted</span>;
      case 'imported':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200"><Upload size={10} /> CSV Imported</span>;
      case 'renewed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200"><RefreshCw size={10} /> Renewed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{action}</span>;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedAction !== 'all' && log.action !== selectedAction) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const inDetails = log.details.toLowerCase().includes(term);
      const inTitle = (log.jobTitle || '').toLowerCase().includes(term);
      const inUser = log.user.toLowerCase().includes(term);
      return inDetails || inTitle || inUser;
    }
    return true;
  });

  return (
    <div className="space-y-6" id="admin-audit-log">
      {/* Header & Filter */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            <span>Audit & Activity Log</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time chronological timeline of all job vacancy changes, creations, imports, and administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="published">Published</option>
            <option value="imported">CSV Imported</option>
            <option value="renewed">Renewed</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/60 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    {getActionBadge(log.action)}
                    <span className="text-xs font-bold text-slate-900">{log.details}</span>
                  </div>
                  {log.jobTitle && (
                    <p className="text-xs text-slate-500 font-medium">
                      Target Vacancy: <strong className="text-slate-700">{log.jobTitle}</strong>
                    </p>
                  )}
                  <span className="text-[11px] text-slate-400 block">
                    Executed by <strong className="text-slate-600">{log.user}</strong>
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 justify-end">
                    <Clock size={11} />
                    <span>{new Date(log.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {new Date(log.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            No activity logs found matching the filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
