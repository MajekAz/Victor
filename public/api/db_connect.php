<?php
/**
 * Promarch Consulting - MySQLi Legacy Compatibility Connector
 * Supports contact form and message endpoints.
 */

// Prevent direct web execution
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

error_reporting(E_ALL);
ini_set('display_errors', '0');

// Locate configuration
$configCandidates = [
    dirname(__DIR__, 2) . '/config.php',
    dirname(__DIR__) . '/../config.php',
    __DIR__ . '/config.php'
];

$configFile = null;
foreach ($configCandidates as $candidate) {
    if (file_exists($candidate)) {
        $configFile = $candidate;
        break;
    }
}

if (!$configFile) {
    header("Content-Type: application/json; charset=utf-8");
    http_response_code(500);
    die(json_encode(["error" => "Configuration file is missing from the server."]));
}
require_once $configFile;

// HTTPS and Session Hardening
$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path'     => '/',
        'domain'   => '', 
        'secure'   => $isSecure, 
        'httponly' => true,
        'samesite' => 'Lax' 
    ]);
    session_start();
}

// Extract database credentials
$host = defined('DB_HOST') ? DB_HOST : ($db_host ?? 'localhost');
$user = defined('DB_USER') ? DB_USER : ($db_user ?? '');
$pass = defined('DB_PASS') ? DB_PASS : ($db_pass ?? '');
$name = defined('DB_NAME') ? DB_NAME : ($db_name ?? '');

$conn = @new mysqli($host, $user, $pass, $name);

if ($conn->connect_error) {
    error_log("Database connection error: " . $conn->connect_error);
    header("Content-Type: application/json; charset=utf-8");
    http_response_code(500);
    die(json_encode(["error" => "Unable to connect to the database. Please try again later."]));
}

$conn->set_charset("utf8mb4");
