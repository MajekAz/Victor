<?php
/**
 * Promarch Consulting - Security, Session, CSRF & Response Helper
 * Production Hardened for Hostinger Apache/PHP Environment
 */

// Prevent direct web execution
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

// Disable direct error output in production to prevent leaking sensitive server paths and SQL
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Determine HTTPS state (accounts for Cloudflare, SSL proxies, and Hostinger edge)
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

// Secure Session Configuration
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_httponly', '1');
    if ($isHttps) {
        ini_set('session.cookie_secure', '1');
    }

    session_set_cookie_params([
        'lifetime' => 86400, // 24 hours
        'path'     => '/',
        'domain'   => '',    // Host-only cookie for maximum cross-site isolation
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// Session Expiry & Idle Invalidation (4 hours of inactivity)
if (!empty($_SESSION['admin_logged_in'])) {
    $now = time();
    if (!empty($_SESSION['last_activity']) && ($now - $_SESSION['last_activity'] > 14400)) {
        $_SESSION = [];
        session_destroy();
    } else {
        $_SESSION['last_activity'] = $now;
    }
}

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

// CORS Policy: Whitelist only genuine Promarch domain or authorized local dev environments.
// NEVER use Access-Control-Allow-Origin: *
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedHosts = [
    'promarchconsulting.co.uk',
    'www.promarchconsulting.co.uk',
    'localhost:3000',
    'localhost:5173',
    '127.0.0.1:3000'
];

if (!empty($origin)) {
    $parsedHost = parse_url($origin, PHP_URL_HOST);
    $parsedPort = parse_url($origin, PHP_URL_PORT);
    $hostWithPort = $parsedHost . ($parsedPort ? ':' . $parsedPort : '');

    if (in_array($parsedHost, $allowedHosts, true) || in_array($hostWithPort, $allowedHosts, true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
    }
}

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ------------------------------------------------------------------------------
// JSON Response Helper
// ------------------------------------------------------------------------------
function sendResponse(bool $success, $data = null, string $message = '', int $statusCode = 200): void {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    
    $payload = ['success' => $success];
    if ($message !== '') {
        $payload['message'] = $message;
    }
    if ($data !== null) {
        $payload['data'] = $data;
    }
    
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ------------------------------------------------------------------------------
// CSRF Protection
// ------------------------------------------------------------------------------
function getCSRFToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken(): bool {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $_POST['csrf_token'] ?? '';
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

// ------------------------------------------------------------------------------
// Authentication & Authorization Enforcement
// ------------------------------------------------------------------------------
function isAdminAuthenticated(): bool {
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

function requireAdminAuth(?PDO $pdo = null): void {
    // 1. Session check
    if (!isAdminAuthenticated()) {
        sendResponse(false, null, 'Unauthorized. Please sign in to the administrator portal.', 401);
    }

    // 2. Database active account verification
    if ($pdo !== null && !empty($_SESSION['admin_user'])) {
        try {
            $stmt = $pdo->prepare("SELECT id, active FROM admin_users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $_SESSION['admin_user']]);
            $admin = $stmt->fetch();

            if (!$admin || (int)$admin['active'] !== 1) {
                // Account was disabled or removed
                $_SESSION = [];
                session_destroy();
                sendResponse(false, null, 'Administrator account is deactivated or no longer exists.', 401);
            }
        } catch (Exception $e) {
            error_log('Admin account verification error: ' . $e->getMessage());
        }
    }

    // 3. CSRF Verification for state-changing write operations (POST, PUT, DELETE)
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
        if (!validateCSRFToken()) {
            sendResponse(false, null, 'Security verification failed: Invalid or missing CSRF token. Please refresh the page and try again.', 403);
        }
    }
}

// ------------------------------------------------------------------------------
// Rate Limiting (Brute Force Protection)
// ------------------------------------------------------------------------------
function checkRateLimit(PDO $pdo, string $ip, int $maxAttempts = 5, int $windowMinutes = 15): bool {
    try {
        // Clean up expired attempts older than the window
        $cleanup = $pdo->prepare("DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL :minutes MINUTE)");
        $cleanup->execute([':minutes' => $windowMinutes]);

        // Count recent failed attempts from this IP
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip_address = :ip AND attempted_at >= (NOW() - INTERVAL :minutes MINUTE)");
        $stmt->execute([':ip' => $ip, ':minutes' => $windowMinutes]);
        $attempts = (int)$stmt->fetchColumn();

        return $attempts < $maxAttempts;
    } catch (Exception $e) {
        error_log('Rate limit check failed: ' . $e->getMessage());
        return true; // Fail safe
    }
}

function recordFailedLogin(PDO $pdo, string $ip): void {
    try {
        $stmt = $pdo->prepare("INSERT INTO login_attempts (ip_address, attempted_at) VALUES (:ip, NOW())");
        $stmt->execute([':ip' => $ip]);
    } catch (Exception $e) {
        error_log('Failed to record login attempt: ' . $e->getMessage());
    }
}

function clearFailedLogins(PDO $pdo, string $ip): void {
    try {
        $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE ip_address = :ip");
        $stmt->execute([':ip' => $ip]);
    } catch (Exception $e) {
        error_log('Failed to clear login attempts: ' . $e->getMessage());
    }
}

// ------------------------------------------------------------------------------
// Input Sanitization
// ------------------------------------------------------------------------------
function sanitizeString(?string $str): string {
    if ($str === null) return '';
    $clean = trim(strip_tags((string)$str));
    // Decode any pre-existing or multiply-nested HTML entities (e.g. &amp;amp;amp; -> &)
    // Repeat up to 10 iterations until all nested entities are fully unescaped to clean plain text
    $iterations = 0;
    while (strpos($clean, '&') !== false && $iterations < 10) {
        $decoded = html_entity_decode($clean, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if ($decoded === $clean) {
            break;
        }
        $clean = $decoded;
        $iterations++;
    }
    return $clean;
}

function sanitizeSlug(string $slug): string {
    $slug = strtolower(trim($slug));
    $slug = preg_replace('/[^a-z0-9-]+/', '-', $slug);
    return trim($slug, '-');
}
