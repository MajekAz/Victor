<?php
/**
 * Promarch Consulting - PDO Database Connection Manager
 * Secure, prepared-statement based database abstraction.
 */

// Prevent direct web execution
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

// Locate configuration: check outside public_html first, then fall back to local /api/ directory
$configCandidates = [
    dirname(__DIR__, 2) . '/config.php', // Outside public_html (e.g., /home/u123456789/config.php)
    dirname(__DIR__) . '/../config.php', // One level above docroot
    __DIR__ . '/config.php'              // Local /public_html/api/config.php
];

$configFile = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) {
        $configFile = $candidate;
        break;
    }
}

if (!$configFile) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Backend configuration missing. Please create config.php with database credentials.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once $configFile;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = defined('DB_HOST') ? DB_HOST : 'localhost';
            $db   = defined('DB_NAME') ? DB_NAME : '';
            $user = defined('DB_USER') ? DB_USER : '';
            $pass = defined('DB_PASS') ? DB_PASS : '';
            $charset = defined('DB_CHARSET') ? DB_CHARSET : 'utf8mb4';

            // Check if placeholders are still present
            if ($host === 'YOUR_HOSTINGER_DB_HOST' || $db === 'YOUR_HOSTINGER_DB_NAME') {
                error_log('Database configuration error: Placeholder credentials detected in config.php');
                header('Content-Type: application/json; charset=utf-8');
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Database configuration is incomplete. Please configure Hostinger MySQL credentials in config.php.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false, // Native prepared statements
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Log detailed error server-side only (never expose passwords, user, or paths to visitors)
                error_log('Database connection failure: ' . $e->getMessage());
                
                header('Content-Type: application/json; charset=utf-8');
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Unable to connect to the database. Please try again later.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        return self::$instance;
    }
}
