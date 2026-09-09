<?php
/**
 * Promarch Consulting - Initial Administrator Account Setup Tool
 * 
 * SECURITY NOTICE:
 * This script is intended to be executed ONCE to bootstrap the first administrator.
 * It strictly creates a bcrypt password hash via PHP password_hash() and stores it in admin_users.
 * The plain-text password is NEVER stored or logged.
 * 
 * USAGE OPTIONS:
 * Option A (Recommended - CLI/SSH):
 *   php setup_admin.php
 * 
 * Option B (Browser via Web):
 *   Visit https://promarchconsulting.co.uk/api/setup_admin.php
 *   (Locked automatically once an admin user exists, and self-deletes upon completion).
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');

// Locate DB connection
$dbCandidates = [
    __DIR__ . '/db.php',
    __DIR__ . '/public/api/db.php',
    dirname(__DIR__) . '/public/api/db.php',
    dirname(__DIR__) . '/api/db.php'
];

$dbFile = null;
foreach ($dbCandidates as $candidate) {
    if (file_exists($candidate)) {
        $dbFile = $candidate;
        break;
    }
}

if (!$dbFile) {
    die("Database connector (db.php) not found. Please ensure this file is placed alongside db.php.\n");
}

require_once $dbFile;

try {
    $pdo = Database::getConnection();
} catch (Exception $e) {
    die("Database connection error: " . $e->getMessage() . "\n");
}

$isCli = (php_sapi_name() === 'cli' || empty($_SERVER['REMOTE_ADDR']));

// Check if an active administrator already exists in the database
$existingAdminsCount = 0;
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM admin_users WHERE active = 1");
    $existingAdminsCount = (int)$stmt->fetchColumn();
} catch (Exception $e) {
    die("Error checking admin_users table. Please import database_schema.sql first.\n");
}

// ------------------------------------------------------------------------------
// CLI Execution Mode
// ------------------------------------------------------------------------------
if ($isCli) {
    echo "=================================================================\n";
    echo " Promarch Consulting - Setup Initial Administrator\n";
    echo "=================================================================\n\n";

    if ($existingAdminsCount > 0) {
        echo "WARNING: There are already {$existingAdminsCount} active administrator account(s) in the database.\n";
        echo "Do you want to add another administrator? (y/N): ";
        $confirm = trim(fgets(STDIN));
        if (strtolower($confirm) !== 'y') {
            echo "Operation cancelled.\n";
            exit(0);
        }
    }

    echo "Enter Administrator Email (e.g., admin@promarchconsulting.co.uk): ";
    $email = strtolower(trim(fgets(STDIN)));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "ERROR: Invalid email address format.\n";
        exit(1);
    }

    echo "Enter Strong Password (minimum 10 characters): ";
    $password = trim(fgets(STDIN));

    if (strlen($password) < 10) {
        echo "ERROR: Password must be at least 10 characters in length.\n";
        exit(1);
    }

    echo "Confirm Password: ";
    $passwordConfirm = trim(fgets(STDIN));

    if ($password !== $passwordConfirm) {
        echo "ERROR: Passwords do not match.\n";
        exit(1);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $insert = $pdo->prepare("
            INSERT INTO admin_users (email, password_hash, role, active, created_at)
            VALUES (:email, :hash, 'admin', 1, NOW())
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), active = 1, updated_at = NOW()
        ");
        $insert->execute([':email' => $email, ':hash' => $hash]);

        echo "\nSUCCESS! Administrator '{$email}' created successfully.\n";
        echo "The password hash has been written to the 'admin_users' database table.\n";
        echo "No plain-text password was saved.\n\n";

        echo "For production security, delete this setup script now? (Y/n): ";
        $del = trim(fgets(STDIN));
        if ($del === '' || strtolower($del) === 'y') {
            if (@unlink(__FILE__)) {
                echo "Setup script deleted successfully.\n";
            } else {
                echo "Please manually delete " . __FILE__ . " via Hostinger File Manager.\n";
            }
        }
    } catch (Exception $e) {
        echo "DATABASE ERROR: " . $e->getMessage() . "\n";
        exit(1);
    }
    exit(0);
}

// ------------------------------------------------------------------------------
// Web Browser Execution Mode
// ------------------------------------------------------------------------------
if ($existingAdminsCount > 0) {
    http_response_code(403);
    echo '<!DOCTYPE html><html><head><title>Setup Locked</title><style>body{font-family:sans-serif;padding:40px;text-align:center;background:#f8fafc;color:#0f172a;} .box{max-width:500px;margin:auto;background:#fff;padding:32px;border:1px solid #e2e8f0;border-radius:12px;}</style></head><body><div class="box"><h2 style="color:#dc2626;">Setup Permanently Locked</h2><p>An administrator account already exists in the database.</p><p>For production security, please delete <code>setup_admin.php</code> from your server via Hostinger File Manager.</p></div></body></html>';
    exit;
}

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = trim($_POST['password'] ?? '');
    $passwordConfirm = trim($_POST['password_confirm'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 10) {
        $error = 'Password must be at least 10 characters long.';
    } elseif ($password !== $passwordConfirm) {
        $error = 'Passwords do not match.';
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        try {
            $insert = $pdo->prepare("
                INSERT INTO admin_users (email, password_hash, role, active, created_at)
                VALUES (:email, :hash, 'admin', 1, NOW())
            ");
            $insert->execute([':email' => $email, ':hash' => $hash]);

            $message = "Administrator account '{$email}' created successfully!";
            @unlink(__FILE__);
        } catch (Exception $e) {
            $error = 'Failed to create administrator account. Please verify database connection.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promarch Consulting - Initial Administrator Setup</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; max-width: 460px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { font-size: 20px; margin: 0 0 8px; color: #38bdf8; font-weight: 600; }
        p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px; }
        label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #cbd5e1; }
        input { width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #f8fafc; font-size: 14px; margin-bottom: 16px; }
        input:focus { outline: none; border-color: #38bdf8; ring: 1px solid #38bdf8; }
        button { width: 100%; padding: 12px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        button:hover { background: #0369a1; }
        .alert { padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
        .alert-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; }
        .alert-success { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #86efac; }
        .notice { font-size: 12px; color: #64748b; margin-top: 16px; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Promarch Consulting</h1>
        <p>One-Time Administrator Account Setup</p>

        <?php if (!empty($error)): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if (!empty($message)): ?>
            <div class="alert alert-success">
                <strong>Success!</strong> <?= htmlspecialchars($message) ?><br><br>
                This setup script has attempted to self-delete from the server. If this file still exists in <code>public/api/setup_admin.php</code>, please delete it manually via Hostinger File Manager.<br><br>
                <a href="/admin" style="color: #38bdf8; text-decoration: underline;">Proceed to Administrator Portal &rarr;</a>
            </div>
        <?php else: ?>
            <form method="POST">
                <div>
                    <label for="email">Administrator Email Address</label>
                    <input type="email" id="email" name="email" placeholder="admin@promarchconsulting.co.uk" required autofocus>
                </div>
                <div>
                    <label for="password">Password (Minimum 10 characters)</label>
                    <input type="password" id="password" name="password" minlength="10" required>
                </div>
                <div>
                    <label for="password_confirm">Confirm Password</label>
                    <input type="password" id="password_confirm" name="password_confirm" minlength="10" required>
                </div>
                <button type="submit">Create Administrator &amp; Hash Password</button>
            </form>
            <div class="notice">
                Passwords are never stored in plain text. A secure bcrypt hash is generated using PHP's <code>password_hash()</code>.
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
