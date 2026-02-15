import React, { useState } from 'react';
import { 
  Loader2, RefreshCw, Mail, Calendar, 
  LogOut, Trash2, KeyRound, Shield, Briefcase, Reply, Eye, EyeOff,
  Users, Globe, Check, AlertCircle, X, Database
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

  // Config State - Safe LocalStorage Access (Hidden from UI)
  const [apiHost] = useState<string>(() => {
    try {
        return localStorage.getItem('api_host') || '';
    } catch (e) {
        return '';
    }
  });

  // Computed Stats
  const totalMessages = messages.length;
  const hiringCount = messages.filter(m => 
    m.subject.toLowerCase().includes('hiring') || 
    m.subject.toLowerCase().includes('staff') ||
    m.subject.toLowerCase().includes('employer') ||
    m.subject.toLowerCase().includes('talent request')
  ).length;
  const jobCount = messages.filter(m => 
    m.subject.toLowerCase().includes('job') || 
    m.subject.toLowerCase().includes('work') ||
    m.subject.toLowerCase().includes('candidate')
  ).length;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(false);
    
    const cleanPassword = passwordInput.trim();
    const activeHost = apiHost || '';
    const loginUrl = `${activeHost}/api/login.php`;

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
        
        // Handle 404 explicitly
        if (response.status === 404) {
             throw new Error("API endpoint not found. Please ensure backend is deployed.");
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
             const data = await response.json();
             if (data.success) {
                 setIsAuthenticated(true);
                 fetchMessages(); // Fetch messages after successful login
             } else {
                 setAuthError(true);
             }
        } else {
            throw new Error(`Server returned ${contentType} instead of JSON.`);
        }
    } catch (e: any) {
        console.error(e);
        setAuthError(true);
        setErrorDetails({ type: 'error', message: `Login failed: ${e.message || "Connection refused"}` });
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const activeHost = apiHost || '';
    try {
        await fetch(`${activeHost}/api/logout.php`, { method: 'POST', credentials: 'include' });
    } catch (e) {
        console.error("Logout API failed", e);
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setMessages([]);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    setMessages(prev => prev.filter(msg => msg.id !== id));
    
    try {
        const activeHost = apiHost || '';
        const targetPath = `${activeHost}/api/delete_message.php`;
        await fetch(targetPath, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
            credentials: 'include'
        });
    } catch (e) {
        console.warn("Delete API failed");
    }
  };

  const handleReply = (email: string, subject: string) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`;
  };

  const fetchMessages = async () => {
    setLoading(true);
    setErrorDetails(null);
    
    const activeHost = apiHost || ''; 
    const targetPath = `${activeHost}/api/get_messages.php`;
    
    try {
      const response = await fetch(targetPath, {
          credentials: 'include'
      });
      
      if (response.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
      }

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.indexOf("application/json") !== -1;

      if (!isJson) {
         throw { type: '404', message: `API missing or returning HTML` };
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setIsAuthenticated(true);
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setMessages(sorted);
      } else if (data.error) {
        throw { type: 'api_error', message: data.error };
      } else {
        setMessages([]);
      }

    } catch (err: any) {
      console.warn("API Connection Issue:", err);
      if (isAuthenticated) {
         setErrorDetails({ 
            type: err.type || 'unknown', 
            message: err.message || "Connection failed." 
         });
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getMessageCategory = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('talent request')) return { label: 'Employer Lead', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Briefcase };
    if (s.includes('employer callback')) return { label: 'Employer Lead', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Briefcase };
    if (s.includes('candidate registration')) return { label: 'Job Seeker', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Users };
    if (s.includes('hiring staff') || s.includes('partnership')) return { label: 'Business Inquiry', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Globe };
    if (s.includes('job') || s.includes('work')) return { label: 'Job Seeker', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Users };
    return { label: 'General Inquiry', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Mail };
  };

  // ----------------------------------------------------------------------
  // RENDER: LOADING
  // ----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="text-blue-500 animate-spin mb-4" size={48} />
        <p className="text-slate-400 font-medium animate-pulse">Connecting to secure server...</p>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: LOGIN
  // ----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
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
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all ${authError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'}`}
                  placeholder="Enter admin password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">Authentication failed. Invalid password.</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex justify-center items-center"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
            </button>
            
            {errorDetails && errorDetails.type === 'error' && (
                <div className="bg-red-50 p-3 rounded text-xs text-red-600 border border-red-100 mt-2 text-center">
                    {errorDetails.message}
                </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: DASHBOARD
  // ----------------------------------------------------------------------
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center">
              Admin Dashboard
              <span className="ml-3 text-xs py-1 px-2 rounded bg-blue-600 text-white uppercase tracking-wider">
                Secure Session
              </span>
            </h1>
            <p className="text-slate-400">Manage incoming inquiries and messages.</p>
          </div>
          <div className="flex gap-3">
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
        
        {/* ERROR BANNER */}
        {errorDetails && (
          <div className={`mb-8 border p-6 rounded-xl shadow-lg relative ${errorDetails.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
             <button 
               onClick={() => setErrorDetails(null)} 
               className={`absolute top-4 right-4 transition-colors p-2 ${errorDetails.type === 'success' ? 'text-green-400 hover:text-green-700' : 'text-red-400 hover:text-red-700'}`}
               title="Dismiss"
             >
               <X size={20} />
             </button>
             <div className="flex items-start pr-12">
               {errorDetails.type === 'success' ? (
                   <Check className="text-green-600 mr-4 mt-1 flex-shrink-0" />
               ) : (
                   <AlertCircle className="text-red-600 mr-4 mt-1 flex-shrink-0" />
               )}
               <div>
                 <h3 className={`text-lg font-black ${errorDetails.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {errorDetails.type === 'success' ? 'Success' : 'Connection Error'}
                 </h3>
                 <p className={`${errorDetails.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{errorDetails.message}</p>
               </div>
             </div>
          </div>
        )}

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                    <Database size={24} />
                </div>
                <div>
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Inquiries</div>
                    <div className="text-3xl font-black text-slate-900">{totalMessages}</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
                    <Briefcase size={24} />
                </div>
                <div>
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Job Applications</div>
                    <div className="text-3xl font-black text-slate-900">{jobCount}</div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
                    <Users size={24} />
                </div>
                <div>
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Hiring Requests</div>
                    <div className="text-3xl font-black text-slate-900">{hiringCount}</div>
                </div>
            </div>
        </div>

        {/* MESSAGES TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Date</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Type</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Sender</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Subject</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500">Message</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => {
                    const category = getMessageCategory(msg.subject);
                    const CategoryIcon = category.icon;
                    return (
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
                         <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${category.color}`}>
                            <CategoryIcon size={12} className="mr-1.5" />
                            {category.label}
                         </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center">
                           <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-3">
                               {getInitials(msg.name)}
                           </div>
                           <div>
                                <div className="font-bold text-slate-900">{msg.name}</div>
                                <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 flex items-center hover:underline mt-0.5">
                                <Mail size={12} className="mr-1" /> {msg.email}
                                </a>
                           </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-sm font-medium text-slate-700">
                          {msg.subject}
                        </span>
                      </td>
                      <td className="p-5 max-w-md">
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {msg.message}
                        </p>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                            <button 
                            onClick={() => handleReply(msg.email, msg.subject)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Reply via Email"
                            >
                            <Reply size={18} />
                            </button>
                            <button 
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Message"
                            >
                            <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )})
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