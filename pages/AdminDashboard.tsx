import React, { useEffect, useState, useRef } from 'react';
import { 
  Loader2, AlertCircle, RefreshCw, Mail, Calendar, Info, Globe, 
  Settings, LogOut, Trash2, KeyRound, Shield, Code, Copy, X, Check, 
  Activity, Database, Users, Briefcase, Reply, Eye, EyeOff
} from 'lucide-react';

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
    subject: "Talent Request: Sunrise Care [Care Sector]",
    message: "SECTOR: Care Sector\nPHONE: 07700900123\nCOMPANY: Sunrise Care\n\nREQUIREMENTS:\nWe urgently need 3 qualified nurses for night shifts.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 102,
    name: "James Miller",
    email: "james@logistics-solutions.com",
    subject: "Employer Callback: FastTrack Logistics",
    message: "Employer callback request.\n\nCompany: FastTrack Logistics\nSector: Logistics\nPhone: 02081234567",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 103,
    name: "David Chen",
    email: "david.c@email.com",
    subject: "Candidate Registration: Logistics",
    message: "New candidate registration.\nSector: Logistics\nName: David Chen",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

// PHP TEMPLATES FOR USER TO COPY
const SERVER_FILES = [
  {
    name: "public_html/api/.htaccess",
    desc: "0. Server Config (Important for Headers/CORS)",
    code: `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
</IfModule>

Options -Indexes`
  },
  {
    name: "public_html/api/db_connect.php",
    desc: "1. Database connection & Session Start. (UPDATED)",
    code: `<?php
// Start secure session handling
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '', // Set to your domain in production if needed
    'secure' => true, // Requires HTTPS
    'httponly' => true,
    'samesite' => 'None' // Required for cross-origin if React is local and PHP is remote
]);
session_start();

// Dynamic CORS for Credentials
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost"; 
$user = "u123379735_Promarch"; 
$pass = "ENTER_YOUR_DB_PASSWORD_HERE"; 
$dbname = "u123379735_Promarch";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: application/json");
    die(json_encode(["error" => "Database connection failed"]));
}
?>`
  },
  {
    name: "public_html/api/login.php",
    desc: "2. Authenticates user and sets session cookie. (NEW)",
    code: `<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

// CHANGE YOUR PASSWORD HERE
$admin_password = "Victor@2026"; 

if (isset($data->password) && $data->password === $admin_password) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(["success" => true, "message" => "Logged in"]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid password"]);
}
$conn->close();
?>`
  },
  {
    name: "public_html/api/logout.php",
    desc: "3. Destroys the session. (NEW)",
    code: `<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

session_unset();
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out"]);
?>`
  },
  {
    name: "public_html/api/get_messages.php",
    desc: "4. Retrieves messages (Protected).",
    code: `<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

// SECURITY CHECK
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

// Check if table exists
$checkTable = $conn->query("SHOW TABLES LIKE 'contact_messages'");
if ($checkTable->num_rows == 0) {
    echo json_encode([]);
    exit();
}

$sql = "SELECT * FROM contact_messages ORDER BY id DESC";
$result = $conn->query($sql);

$messages = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}
echo json_encode($messages);
$conn->close();
?>`
  },
  {
    name: "public_html/api/submit_contact.php",
    desc: "5. Public submission & Email Sending.",
    code: `<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if(isset($data->name) && isset($data->email)) {
    $name = $conn->real_escape_string($data->name);
    $email = $conn->real_escape_string($data->email);
    $subject = isset($data->subject) ? $conn->real_escape_string($data->subject) : 'No Subject';
    $message = isset($data->message) ? $conn->real_escape_string($data->message) : '';
    $created_at = date('Y-m-d H:i:s');

    $table_sql = "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        subject VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->query($table_sql);

    $sql = "INSERT INTO contact_messages (name, email, subject, message, created_at)
            VALUES ('$name', '$email', '$subject', '$message', '$created_at')";

    if ($conn->query($sql) === TRUE) {
        // --- SEND EMAIL NOTIFICATION ---
        $to = "info@promarchconsulting.co.uk";
        $email_subject = "New Inquiry: " . $data->subject;
        
        $email_body = "You have received a new message from your website contact form.\n\n";
        $email_body .= "Name: " . $data->name . "\n";
        $email_body .= "Email: " . $data->email . "\n";
        $email_body .= "Subject: " . $data->subject . "\n\n";
        $email_body .= "Message:\n" . $data->message . "\n";
        
        $headers = "From: website@promarchconsulting.co.uk\r\n";
        $headers .= "Reply-To: " . $data->email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        mail($to, $email_subject, $email_body, $headers);
        // -------------------------------

        echo json_encode(["message" => "Message sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete data"]);
}
$conn->close();
?>`
  },
  {
    name: "public_html/api/delete_message.php",
    desc: "6. Deletes message (Protected).",
    code: `<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

// SECURITY CHECK
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = intval($data->id);
    $sql = "DELETE FROM contact_messages WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting"]);
    }
}
$conn->close();
?>`
  }
];

const AdminDashboard: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ type: string, message: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [debugUrl, setDebugUrl] = useState<string>('');
  
  // UI State
  const [showConfig, setShowConfig] = useState(false);
  const [showServerSetup, setShowServerSetup] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({});

  // Config State
  const [apiHost, setApiHost] = useState<string>(() => localStorage.getItem('api_host') || '');
  
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

  // Check Session on Mount
  useEffect(() => {
    checkSessionOnMount();
  }, []);

  const checkSessionOnMount = async () => {
      setLoading(true);
      const activeHost = apiHost || '';
      const targetPath = `${activeHost}/api/get_messages.php`;
      try {
        const response = await fetch(targetPath, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                setIsAuthenticated(true);
                setMessages(data);
            }
        }
      } catch (e) {
          // Silent fail on mount
      } finally {
          setLoading(false);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(false);
    
    const cleanPassword = passwordInput.trim();
    const activeHost = apiHost || '';
    const loginUrl = `${activeHost}/api/login.php`;

    // ---------------------------------------------------------
    // MASTER KEY OVERRIDE
    // ---------------------------------------------------------
    if (cleanPassword === 'Victor@2026') {
        setTimeout(() => {
            setIsAuthenticated(true);
            setIsDemoMode(true);
            setMessages(MOCK_MESSAGES);
            setErrorDetails({ type: 'success', message: 'Master Key Accepted. Local Mode Active.' });
            setIsLoggingIn(false);
        }, 500);
        return;
    }

    // ---------------------------------------------------------
    // STANDARD LOGIN (Server Auth)
    // ---------------------------------------------------------
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: cleanPassword }),
            credentials: 'include',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
             const data = await response.json();
             if (data.success) {
                 setIsAuthenticated(true);
                 fetchMessages(); // Only fetch real messages if real login succeeded
             } else {
                 setAuthError(true);
             }
        } else {
            throw new Error("Invalid response");
        }
    } catch (e) {
        setAuthError(true);
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    const activeHost = apiHost || '';
    if (!isDemoMode) {
        try {
            await fetch(`${activeHost}/api/logout.php`, { method: 'POST', credentials: 'include' });
        } catch (e) {
            console.error("Logout API failed", e);
        }
    }
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setPasswordInput('');
    setMessages([]);
  };

  const saveApiHost = (host: string) => {
    const cleanHost = host.replace(/\/$/, '');
    setApiHost(cleanHost);
    localStorage.setItem('api_host', cleanHost);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const checkHealth = async () => {
     setHealthStatus({});
     const baseUrl = apiHost || '';
     const files = ['get_messages.php', 'login.php'];
     const results: Record<string, string> = {};

     for (const file of files) {
        try {
           const url = `${baseUrl}/api/${file}`;
           const res = await fetch(url, { method: 'OPTIONS' });
           if (res.status === 200 || res.status === 204) results[file] = 'OK';
           else if (res.status === 404) results[file] = 'Missing (404)';
           else if (res.status === 500) results[file] = 'Database Error (500)';
           else results[file] = `Error ${res.status}`;
        } catch (e) {
           results[file] = 'Network/CORS Error';
        }
     }
     setHealthStatus(results);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    setMessages(prev => prev.filter(msg => msg.id !== id));
    if (!isDemoMode) {
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
    }
  };

  const handleReply = (email: string, subject: string) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`;
  };

  const fetchMessages = async (hostOverride?: string) => {
    if (isDemoMode) {
        setMessages(MOCK_MESSAGES);
        return;
    }

    setLoading(true);
    setErrorDetails(null);
    
    const activeHost = hostOverride !== undefined ? hostOverride : apiHost;
    const baseUrl = activeHost || ''; 
    const targetPath = `${baseUrl}/api/get_messages.php`;
    
    setDebugUrl(displayUrl(targetPath, activeHost));

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
         throw { type: '404', message: `API file missing or returning HTML: ${targetPath}` };
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
      if (isAuthenticated && !isDemoMode) {
         setErrorDetails({ 
            type: err.type || 'unknown', 
            message: err.message || "Connection failed" 
         });
      }
    } finally {
      setLoading(false);
    }
  };

  const displayUrl = (path: string, host: string) => {
      return host ? path : `${window.location.origin}${path}`;
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
  // RENDER: LOGIN
  // ----------------------------------------------------------------------
  if (!isAuthenticated && !loading) {
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
             {showConfig && (
                <div className="mb-4">
                    <label className="block text-xs font-bold text-slate-500 mb-1">API Host URL</label>
                    <input 
                        type="text" 
                        placeholder="https://promarchconsulting.co.uk" 
                        defaultValue={apiHost}
                        onBlur={(e) => saveApiHost(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                    />
                </div>
             )}

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
              {authError && <p className="text-red-500 text-xs font-bold mt-2 ml-1">Authentication failed. Check password or connection.</p>}
            </div>
            
            <div className="flex flex-col gap-3">
                <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex justify-center items-center"
                >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
                </button>
                
                <div className="flex gap-2 justify-center mt-2">
                    <button 
                        type="button" 
                        onClick={() => setShowServerSetup(true)}
                        className="text-xs text-slate-400 hover:text-slate-600 underline flex items-center"
                    >
                        <Code size={12} className="mr-1"/> API Files
                    </button>
                    <span className="text-slate-300">|</span>
                    <button 
                        type="button" 
                        onClick={() => setShowConfig(!showConfig)} 
                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                    >
                        {showConfig ? "Hide Config" : "Config"}
                    </button>
                </div>
            </div>
          </form>
        </div>

        {/* SETUP MODAL (Accessible from login) */}
        {showServerSetup && (
          <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-fade-in-up">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Backend Server Setup</h2>
                  <p className="text-slate-500 text-sm">Create these files in your <code>public_html/api</code> folder.</p>
                </div>
                <button onClick={() => setShowServerSetup(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-6 space-y-8 bg-slate-50">
                {SERVER_FILES.map((file, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 font-mono text-sm">{file.name}</h3>
                        <p className="text-xs text-slate-500">{file.desc}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(file.code, idx)}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedIndex === idx ? 'bg-green-100 text-green-700' : 'bg-white border hover:bg-slate-50'}`}
                      >
                        {copiedIndex === idx ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copiedIndex === idx ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-50 text-xs overflow-x-auto font-mono leading-relaxed">
                      {file.code}
                    </pre>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200 bg-white text-right">
                <button onClick={() => setShowServerSetup(false)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">Close Guide</button>
              </div>
            </div>
          </div>
        )}
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
              <span className={`ml-3 text-xs py-1 px-2 rounded text-white uppercase tracking-wider ${isDemoMode ? 'bg-amber-600' : 'bg-blue-600'}`}>
                {isDemoMode ? 'Local Mode' : 'Secure Session'}
              </span>
            </h1>
            <p className="text-slate-400">Manage incoming inquiries and messages.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowServerSetup(true)}
                className="flex items-center bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition-colors border border-slate-700 text-sm"
                title="Get PHP Files"
             >
                 <Code size={16} className="mr-2" />
                 API Files
             </button>
             <button 
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition-colors border border-slate-700 text-sm"
             >
                 <Settings size={16} className="mr-2" />
                 Config
             </button>
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
        
        {/* CONFIG PANEL */}
        {showConfig && (
          <div className="bg-white border-b-4 border-blue-500 p-6 rounded-xl shadow-xl mb-8 animate-fade-in-up">
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center">
               <Globe className="mr-2 text-blue-500" /> Connect to Live Backend
            </h3>
            <div className="flex gap-4 mb-4">
              <input 
                type="text" 
                placeholder="https://promarchconsulting.co.uk" 
                defaultValue={apiHost}
                className="flex-grow px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                onBlur={(e) => saveApiHost(e.target.value)}
              />
              <button onClick={() => fetchMessages()} className="bg-slate-900 text-white px-6 rounded-lg font-bold">Save</button>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
               <div>
                  <h4 className="font-bold text-sm text-slate-700 flex items-center"><Activity size={16} className="mr-2"/> API Health Check</h4>
                  <p className="text-xs text-slate-500">Ping server to verify file existence</p>
               </div>
               <div className="flex gap-4">
                   <button onClick={() => setShowServerSetup(true)} className="text-slate-600 font-bold text-sm hover:underline flex items-center"><Code size={14} className="mr-1"/> View Code</button>
                   <button onClick={checkHealth} className="text-blue-600 font-bold text-sm hover:underline">Check API Status</button>
               </div>
            </div>
            {Object.keys(healthStatus).length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(healthStatus).map(([file, status]) => (
                        <div key={file} className={`p-3 rounded border text-xs font-mono flex justify-between ${status === 'OK' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            <span>{file}</span>
                            <span className="font-bold">{status}</span>
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}

        {/* ERROR BANNER WITH SETUP ACTION */}
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
                 <p className={`${errorDetails.type === 'success' ? 'text-green-700' : 'text-red-700'} mb-3`}>{errorDetails.message}</p>
                 
                 {errorDetails.type !== 'success' && (
                     <button 
                       onClick={() => setShowServerSetup(true)}
                       className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center transition-colors"
                     >
                       <Code size={16} className="mr-2" />
                       View Server Setup & API Files
                     </button>
                 )}
                 {errorDetails.type === '404' && <p className="text-xs mt-3 font-mono bg-white p-2 border rounded text-slate-500 break-all">{debugUrl}</p>}
               </div>
             </div>
          </div>
        )}

        {/* SETUP MODAL */}
        {showServerSetup && (
          <div className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative animate-fade-in-up">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Backend Server Setup</h2>
                  <p className="text-slate-500 text-sm">Create these files in your <code>public_html/api</code> folder.</p>
                </div>
                <button onClick={() => setShowServerSetup(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 space-y-8 bg-slate-50">
                {SERVER_FILES.map((file, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-slate-800 font-mono text-sm">{file.name}</h3>
                        <p className="text-xs text-slate-500">{file.desc}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(file.code, idx)}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedIndex === idx ? 'bg-green-100 text-green-700' : 'bg-white border hover:bg-slate-50'}`}
                      >
                        {copiedIndex === idx ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copiedIndex === idx ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-50 text-xs overflow-x-auto font-mono leading-relaxed">
                      {file.code}
                    </pre>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-white text-right">
                <button onClick={() => setShowServerSetup(false)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEMO MODE NOTICE */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-center mb-8 shadow-sm">
            <Info size={20} className="mr-2 flex-shrink-0" />
            <span className="font-medium text-sm">Local Mode Active: Showing sample data because the Master Key was used.</span>
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