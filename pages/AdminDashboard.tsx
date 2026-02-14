import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Trash2, Mail, Calendar } from 'lucide-react';
import { COLORS } from '../constants.tsx';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch from the PHP backend on Hostinger
      const response = await fetch('/api/get_messages.php');
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid API response. Ensure API files are uploaded to 'public_html/api/'");
      }

      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Unknown error fetching messages');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">View incoming inquiries from the contact form.</p>
          </div>
          <button 
            onClick={fetchMessages} 
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center mb-8 shadow-lg">
            <AlertCircle size={20} className="mr-2" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {loading && !messages.length ? (
          <div className="bg-white p-20 rounded-xl shadow-sm text-center">
            <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Loading submissions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                    <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">From</th>
                    <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Subject</th>
                    <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                        No messages found. Test the contact form to see data here.
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-5 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-slate-400" />
                            {new Date(msg.created_at).toLocaleDateString()}
                            <span className="ml-2 text-xs opacity-60">{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-900">{msg.name}</div>
                          <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 flex items-center hover:underline mt-1">
                            <Mail size={12} className="mr-1" /> {msg.email}
                          </a>
                        </td>
                        <td className="p-5">
                          <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
                            {msg.subject}
                          </span>
                        </td>
                        <td className="p-5 max-w-md">
                          <p className="text-slate-600 text-sm leading-relaxed">{msg.message}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;