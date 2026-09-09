<?php
/**
 * Promarch Consulting - Admin Authentication & Session API
 * Secure session management, password_hash verification, CSRF token issuance, and rate limiting.
 * Strict database-only authentication using admin_users table.
 */

// Prevent direct web execution
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    // Only API calls with query/body
}

require_once __DIR__ . '/../security.php';
require_once __DIR__ . '/../db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ------------------------------------------------------------------------------
// GET ?action=check: Verify current session & return active CSRF token
// ------------------------------------------------------------------------------
if ($method === 'GET' && ($action === 'check' || $action === 'status')) {
    if (isAdminAuthenticated()) {
        // Confirm account remains active in database
        try {
            $stmt = $pdo->prepare("SELECT id, email, role, active FROM admin_users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $_SESSION['admin_user'] ?? '']);
            $admin = $stmt->fetch();

            if ($admin && (int)$admin['active'] === 1) {
                sendResponse(true, [
                    'isAuthenticated' => true,
                    'user'            => $admin['email'],
                    'role'            => $admin['role'],
                    'csrfToken'       => getCSRFToken()
                ]);
            } else {
                // Account deactivated or deleted
                $_SESSION = [];
                session_destroy();
                sendResponse(true, [
                    'isAuthenticated' => false,
                    'csrfToken'       => getCSRFToken()
                ]);
            }
        } catch (Exception $e) {
            error_log('Session check db error: ' . $e->getMessage());
            sendResponse(true, [
                'isAuthenticated' => false,
                'csrfToken'       => getCSRFToken()
            ]);
        }
    } else {
        sendResponse(true, [
            'isAuthenticated' => false,
            'csrfToken'       => getCSRFToken()
        ]);
    }
}

// ------------------------------------------------------------------------------
// POST ?action=login: Admin Login (Database-only password_verify)
// ------------------------------------------------------------------------------
if ($method === 'POST' && ($action === 'login' || empty($action))) {
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    // 1. Check Rate Limit (5 attempts per 15 minutes)
    if (!checkRateLimit($pdo, $clientIp, 5, 15)) {
        sendResponse(false, null, 'Too many failed login attempts. For security reasons, please wait 15 minutes before trying again.', 429);
    }

    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?? [];
    $password = trim($data['password'] ?? '');
    $email    = strtolower(trim($data['email'] ?? $data['username'] ?? ''));

    if (empty($password) || empty($email)) {
        recordFailedLogin($pdo, $clientIp);
        sendResponse(false, null, 'Administrator email and password are both required.', 400);
    }

    try {
        // Authenticate strictly against admin_users table
        $stmt = $pdo->prepare("SELECT id, email, password_hash, role, active FROM admin_users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $userRow = $stmt->fetch();

        if ($userRow && (int)$userRow['active'] === 1 && password_verify($password, $userRow['password_hash'])) {
            // Clear rate limiting counter upon successful authentication
            clearFailedLogins($pdo, $clientIp);

            // Regenerate session ID to prevent session fixation attacks
            session_regenerate_id(true);

            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id']   = (int)$userRow['id'];
            $_SESSION['admin_user']      = $userRow['email'];
            $_SESSION['admin_role']      = $userRow['role'];
            $_SESSION['last_activity']   = time();

            // Update last_login timestamp
            $updateStmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = :id");
            $updateStmt->execute([':id' => $userRow['id']]);

            // Issue CSRF Token
            $csrfToken = getCSRFToken();

            // Record login audit event
            try {
                $logStmt = $pdo->prepare("
                    INSERT INTO admin_activity_logs (action, details, admin_user, ip_address, created_at)
                    VALUES ('login', 'Administrator authenticated successfully', :user, :ip, NOW())
                ");
                $logStmt->execute([':user' => $userRow['email'], ':ip' => $clientIp]);
            } catch (Exception $logErr) {
                // Ignore audit log failure
            }

            sendResponse(true, [
                'isAuthenticated' => true,
                'user'            => $userRow['email'],
                'role'            => $userRow['role'],
                'csrfToken'       => $csrfToken
            ], 'Authentication verified successfully.');
        } else {
            // Authentication failed
            recordFailedLogin($pdo, $clientIp);
            sendResponse(false, null, 'Invalid administrator credentials. Please check your email and password.', 401);
        }
    } catch (Exception $e) {
        error_log('Authentication error: ' . $e->getMessage());
        sendResponse(false, null, 'An internal error occurred during authentication. Please try again later.', 500);
    }
}

// ------------------------------------------------------------------------------
// POST ?action=logout: Admin Logout & Session Invalidation
// ------------------------------------------------------------------------------
if ($method === 'POST' && $action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
    sendResponse(true, null, 'Logged out successfully.');
}

sendResponse(false, null, 'Invalid authentication request.', 400);
