import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Mail, Calendar, Info, CheckCircle, ServerCrash, FileQuestion, Lock, ExternalLink, Globe, Settings, LogOut, Trash2, KeyRound, Shield } from 'lucide-react';
import { COLORS } from '../constants.tsx';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// Sample data to show when API is not connected
const MOCK_MESSAGES: Message[] = [
  {
    id: 101,
    name: "Sarah Williams",
    email: "sarah.w@carehome-london.co.uk",
    subject: "Hiring Staff",
    message: "We urgently need 3 qualified nurses for night shifts starting next week. Please contact us to discuss rates.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 102,
    name: "James Miller",
    email: "james@logistics-solutions.com",
    subject: "Partnership Inquiry",
    message: "Hi, we are a logistics firm looking to partner with a reliable agency for seasonal warehouse staff.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 103,
    name: "David Chen",
    email: "david.c@email.com",
    subject: "Looking for a Job",
    message: "I am a forklift driver with 5 years experience looking for immediate work in East London. Attached is my CV details...",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

const AdminDashboard: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ type: '404' | 'cors' | 'file_missing' | '500' | 'json' | 'db_auth' | 'unknown', message: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [debugUrl, setDebugUrl] = useState<string>('');
  
  // Config State
  const [apiHost, setApiHost] = useState<string>(() => localStorage.getItem('api_host') || '');
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Check Authentication on Mount
  useEffect(() => {
    const sessionAuth = localStorage.getItem('promarch_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Detect if running in a dev environment
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname.includes('google') || hostname.includes('webcontainer') || hostname.includes('sandbox')) {
      setIsDevEnvironment(true);
      if (!apiHost) setShowConfig(true);
    }
  }, []);

  // Fetch messages when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check. In production, this should be handled by the backend.
    // Default password is 'admin123'
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem('promarch_admin_auth', 'true');
      fetchMessages();
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('promarch_admin_auth');
    setPasswordInput('');
  };

  const saveApiHost = (host: string) => {
    const cleanHost = host.replace(/\/$/, '');
    setApiHost(cleanHost);
    localStorage.setItem('api_host', cleanHost);
    setTimeout(() => fetchMessages(cleanHost), 100);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;

    // Optimistically remove from UI
    setMessages(prev => prev.filter(msg => msg.id !== id));

    // Attempt to call backend deletion (Optional: requires delete_messages.php on server)
    try {
       const activeHost = apiHost || '';
       const targetPath = `${activeHost}/api/delete_message.php`;
       await fetch(targetPath, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id })
       });
    } catch (e) {
      console.warn("Delete API not available or failed, but message removed from view.");
    }
  };

  const fetchMessages = async (hostOverride?: string) => {
    setLoading(true);
    setErrorDetails(null);
    setIsDemoMode(false);
    
    const activeHost = hostOverride !== undefined ? hostOverride : apiHost;
    const baseUrl = activeHost || ''; 
    const targetPath = `${baseUrl}/api/get_messages.php`;
    
    const displayUrl = activeHost 
      ? targetPath 
      : `${window.location.origin}${targetPath}`;
      
    setDebugUrl(displayUrl);

    try {
      const response = await fetch(targetPath).catch(err => {
        if (activeHost && err.message === 'Failed to fetch') {
           throw {
             type: 'cors',
             message: "Network Error: This is likely a CORS issue. Your Hostinger PHP script needs to allow connections from this dev environment."
           };
        }
        throw err;
      });
      
      if (response.status === 404) {
        let setupFileExists = false;
        try {
            const checkSetup = await fetch(`${baseUrl}/api/setup_table.php`);
            if (checkSetup.status === 200) setupFileExists = true;
        } catch(e) {}

        if (setupFileExists) {
           throw { 
            type: 'file_missing', 
            message: "Database connected successfully (setup_table found), but 'get_messages.php' is missing." 
          };
        }

        throw { 
          type: '404', 
          message: `The file '${targetPath}' was not found.` 
        };
      }

      if (response.status === 500) {
        throw { 
          type: '500', 
          message: "Internal Server Error. The PHP script crashed." 
        };
      }

      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const preview = text.substring(0, 100).replace(/<[^>]*>?/gm, '');
        throw { 
          type: 'json', 
          message: `The server responded, but not with data. Response: "${preview}..."` 
        };
      }

      if (Array.isArray(data)) {
        // Sort by ID descending (newest first) if created_at isn't reliable
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setMessages(sorted);
      } else if (data.error) {
        if (data.error.includes("Access denied")) {
           throw { type: 'db_auth', message: data.error };
        }
        throw { type: 'unknown', message: data.error };
      } else {
        setMessages([]);
      }

    } catch (err: any) {
      console.warn("API Connection Issue:", err);
      if (err.type) {
        setErrorDetails(err);
      } else {
        setErrorDetails({ type: 'unknown', message: err.message || "Unknown connectivity error" });
      }
      setMessages(MOCK_MESSAGES);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // RENDER: LOGIN SCREEN
  // ----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Access</h1>
            <p className="text-slate-500">Promarch Consulting Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all ${authError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'}`}
                  placeholder="Enter admin password"
                />
              </div>
              {authError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">Incorrect password. Try 'admin123'</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              Login to Dashboard
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>Protected Area. Unauthorized access is prohibited.</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center">
              Admin Dashboard
              <span className="ml-3 bg-blue-600 text-xs py-1 px-2 rounded text-white uppercase tracking-wider">Secure</span>
            </h1>
            <p className="text-slate-400">Manage incoming inquiries and messages.</p>
          </div>
          <div className="flex gap-3">
             {isDevEnvironment && (
               <button 
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition-colors border border-slate-700 text-sm"
               >
                 <Settings size={16} className="mr-2" />
                 Config
               </button>
             )}
            <button 
              onClick={() => fetchMessages()} 
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors text-sm"
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-20">
        
        {/* DEV ENVIRONMENT CONFIG PANEL */}
        {showConfig && (
          <div className="bg-white border-b-4 border-blue-500 p-6 rounded-xl shadow-xl mb-8 animate-fade-in-up">
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center">
               <Globe className="mr-2 text-blue-500" /> Connect to Live Backend
            </h3>
            <div className="flex gap-4">
              <div className="flex-grow">
                <input 
                  type="text" 
                  placeholder="https://promarchconsulting.co.uk" 
                  defaultValue={apiHost}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  onBlur={(e) => saveApiHost(e.target.value)}
                />
              </div>
              <button onClick={() => fetchMessages()} className="bg-slate-900 text-white px-6 rounded-lg font-bold">Save</button>
            </div>
          </div>
        )}

        {/* ERROR BANNERS */}
        {errorDetails && (
          <div className="mb-8 bg-red-50 border border-red-200 p-6 rounded-xl shadow-lg flex items-start">
             <AlertCircle className="text-red-600 mr-4 mt-1 flex-shrink-0" />
             <div>
               <h3 className="text-lg font-black text-red-800">Connection Error</h3>
               <p className="text-red-700">{errorDetails.message}</p>
               {errorDetails.type === '404' && <p className="text-xs mt-2 font-mono bg-white p-2 border rounded">{debugUrl}</p>}
             </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-center mb-8 shadow-sm">
            <Info size={20} className="mr-2 flex-shrink-0" />
            <span className="font-medium text-sm">Demo Mode Active: Showing sample data.</span>
          </div>
        )}

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Sender</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Subject</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Message</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="p-5 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-slate-400" />
                          {new Date(msg.created_at).toLocaleDateString()}
                          <span className="ml-2 text-xs opacity-60">
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-900">{msg.name}</div>
                        <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 flex items-center hover:underline mt-1">
                          <Mail size={12} className="mr-1" /> {msg.email}
                        </a>
                      </td>
                      <td className="p-5">
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 border border-slate-200">
                          {msg.subject}
                        </span>
                      </td>
                      <td className="p-5 max-w-md">
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {msg.message}
                        </p>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;