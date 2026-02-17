import React, { useState } from 'react';
import { 
  Loader2, RefreshCw, Mail, Calendar, 
  LogOut, Trash2, KeyRound, Shield, Briefcase, Reply, Eye, EyeOff,
  Users, Globe, Check, AlertCircle, X, Database, Lock, Server
} from 'lucide-react';

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
  const [authError, setAuthError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{ type: string, message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(false);
    
    const cleanPassword = passwordInput.trim();
    const loginUrl = 'api/login.php';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: cleanPassword }),
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.status === 404) {
             throw new Error("API endpoint not found. Please ensure build is finished.");
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
             const data = await response.json();
             if (data.success) {
                 setIsAuthenticated(true);
                 fetchMessages(); 
             } else {
                 setAuthError(true);
             }
        } else {
            throw new Error(`Server returned HTML. This usually means the API file is missing or build failed.`);
        }
    } catch (e: any) {
        console.error(e);
        setAuthError(true);
        setErrorDetails({ type: 'error', message: `Security Gateway Error: ${e.message || "Connection refused"}` });
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
        await fetch('api/logout.php', { method: 'POST', credentials: 'include' });
    } catch (e) {
        console.error("Logout API failed", e);
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setMessages([]);
  };

  const fetchMessages = async () => {
    setLoading(true);
    setErrorDetails(null);
    const targetPath = 'api/get_messages.php';
    
    try {
      const response = await fetch(targetPath, { credentials: 'include' });
      if (response.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setIsAuthenticated(true);
        setMessages(data.sort((a, b) => b.id - a.id));
      }
    } catch (err: any) {
      console.warn("API Connection Issue:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={48} />
        <p className="text-slate-400 font-medium">Verifying Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 mb-8 border border-blue-600/20">
            <Lock className="text-blue-500" size={36} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Promarch Security</h1>
          <p className="text-slate-500 text-sm mb-10">Authorized Access Only</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-950 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-mono"
                placeholder="Authorization Key"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {authError && <p className="text-red-500 text-xs font-bold text-left ml-2">Invalid Access Credentials</p>}
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex justify-center items-center disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" /> : "Verify Identity"}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-slate-600 text-[10px] font-bold uppercase tracking-widest flex justify-center gap-6">
            <span className="flex items-center gap-1"><Shield size={10}/> Encrypted</span>
            <span className="flex items-center gap-1"><Server size={10}/> Production</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[32px] p-8 text-white mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-black">Staff Control Panel</h1>
            <p className="text-slate-400 text-sm">Managing active recruitment inquiries.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchMessages} className="bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                <RefreshCw size={14} /> Sync Logs
             </button>
             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                <LogOut size={14} /> Exit
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden mb-20">
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <tr>
                   <th className="p-6">Origin</th>
                   <th className="p-6">Category</th>
                   <th className="p-6">Timestamp</th>
                   <th className="p-6 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                {messages.length === 0 ? (
                    <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold">NO MESSAGES FOUND</td></tr>
                ) : (
                    messages.map(msg => (
                        <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-6">
                              <div className="font-bold text-slate-900">{msg.name}</div>
                              <div className="text-xs text-blue-600">{msg.email}</div>
                           </td>
                           <td className="p-6">
                              <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{msg.subject}</span>
                           </td>
                           <td className="p-6 text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</td>
                           <td className="p-6 text-right">
                              <button className="text-slate-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                           </td>
                        </tr>
                    ))
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;