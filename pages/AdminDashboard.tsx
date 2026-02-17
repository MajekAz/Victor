
import React, { useState, useEffect } from 'react';
// Added Database to the imports from lucide-react
import { 
  Loader2, RefreshCw, LogOut, Trash2, KeyRound, Shield, Eye, EyeOff,
  Lock, Server, AlertCircle, CheckCircle2, Globe, Wifi, Copy, Database, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Status & Error State
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [authError, setAuthError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Check API availability on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      // Check if db_connect exists (it should return 403 or 500 but at least respond)
      const resp = await fetch('api/login.php', { method: 'HEAD' });
      if (resp.status === 404) {
        setApiStatus('offline');
      } else {
        setApiStatus('online');
      }
    } catch (e) {
      setApiStatus('offline');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    
    const cleanPassword = passwordInput.trim();
    // Use absolute-style path from root
    const loginUrl = 'api/login.php';

    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: cleanPassword }),
            credentials: 'include'
        });
        
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
             const data = await response.json();
             if (data.success) {
                 setIsAuthenticated(true);
                 fetchMessages(); 
             } else {
                 setAuthError(data.error || "Invalid access credentials.");
             }
        } else {
            // This is the HTML error case
            const text = await response.text();
            const isHtml = text.trim().startsWith('<');
            const errorMsg = isHtml 
              ? `System Error: The API file was not found (404) or the server returned a page instead of data. Please ensure the 'api' folder is uploaded to your public_html.`
              : `Server Error: ${text.substring(0, 100)}...`;
            throw new Error(errorMsg);
        }
    } catch (e: any) {
        console.error(e);
        setAuthError(e.message || "Connection to security gateway failed.");
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
        await fetch('api/logout.php', { method: 'POST', credentials: 'include' });
    } catch (e) { console.error(e); }
    setIsAuthenticated(false);
    setPasswordInput('');
    setMessages([]);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('api/get_messages.php', { credentials: 'include' });
      if (response.status === 401) {
          setIsAuthenticated(false);
          return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.warn("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyError = () => {
    if (authError) {
      navigator.clipboard.writeText(authError);
      alert("Error details copied to clipboard. Please send this to support.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 mb-8 border border-blue-600/20">
            <Lock className="text-blue-500" size={36} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Promarch Security</h1>
          <p className="text-slate-500 text-sm mb-10 font-medium">Authorized Administrative Access</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-12 pr-12 py-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-mono placeholder:font-sans placeholder:text-slate-700"
                placeholder="Enter Secure Password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <div className="flex-1">
                    <p className="text-red-500 text-xs font-bold leading-tight mb-2">{authError}</p>
                    <button 
                      type="button"
                      onClick={copyError}
                      className="text-[10px] text-red-400 font-black uppercase tracking-widest flex items-center gap-1 hover:text-red-300"
                    >
                      <Copy size={10} /> Copy Details
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoggingIn || apiStatus === 'offline'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex justify-center items-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"}
            </button>
          </form>

          <div className="mt-6">
             <Link to="/" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ArrowLeft size={14} /> Back to Website
             </Link>
          </div>

          {/* Diagnostic Status Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col gap-4">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-600">API Gateway</span>
                <span className={`flex items-center gap-1.5 ${apiStatus === 'online' ? 'text-emerald-500' : apiStatus === 'offline' ? 'text-red-500' : 'text-slate-400'}`}>
                   {apiStatus === 'checking' && <Loader2 size={10} className="animate-spin" />}
                   {apiStatus === 'online' && <CheckCircle2 size={10} />}
                   {apiStatus === 'offline' && <Wifi size={10} />}
                   {apiStatus}
                </span>
             </div>
             <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                <span className="flex items-center gap-1"><Shield size={10}/> TLS 1.3</span>
                <span className="flex items-center gap-1"><Server size={10}/> Production</span>
                <span className="flex items-center gap-1"><Globe size={10}/> UK-S1</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[32px] p-8 text-white mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-0"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight">Staff Control Panel</h1>
            <p className="text-slate-400 text-sm font-medium">Managing active recruitment inquiries.</p>
          </div>
          <div className="flex gap-4 relative z-10">
             <button 
                onClick={fetchMessages} 
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
             >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
                {loading ? 'Syncing...' : 'Sync Logs'}
             </button>
             <button 
                onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/20"
             >
                <LogOut size={14} /> Exit
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <tr>
                     <th className="p-6">Origin & Contact</th>
                     <th className="p-6">Category</th>
                     <th className="p-6">Timestamp</th>
                     <th className="p-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {messages.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={4} className="p-32 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <Database className="text-slate-200" size={48} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No inquiries found in database</p>
                          </div>
                        </td>
                      </tr>
                  ) : (
                      messages.map(msg => (
                          <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="p-6">
                                <div className="font-bold text-slate-900">{msg.name}</div>
                                <div className="text-xs font-medium text-blue-600">{msg.email}</div>
                             </td>
                             <td className="p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100">
                                  {msg.subject}
                                </span>
                             </td>
                             <td className="p-6">
                                <div className="text-xs font-bold text-slate-500">
                                  {new Date(msg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                             </td>
                             <td className="p-6 text-right">
                                <button className="text-slate-300 hover:text-red-600 p-2 transition-colors opacity-0 group-hover:opacity-100">
                                  <Trash2 size={18}/>
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
