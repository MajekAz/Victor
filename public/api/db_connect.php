<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable direct error output to keep JSON clean

// Load Configuration
if (!file_exists(__DIR__ . '/config.php')) {
    header("Content-Type: application/json");
    http_response_code(500);
    die(json_encode(["error" => "Configuration file 'config.php' is missing from the server."]));
}
require_once __DIR__ . '/config.php';

// Session Security - Use Lax for standard shared hosting compatibility
$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => '', 
        'secure' => $isSecure, 
        'httponly' => true,
        'samesite' => 'Lax' 
    ]);
    session_start();
}

// Dynamic CORS for Admin Dashboard
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    header("Content-Type: application/json");
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed. Please check your credentials in config.php."]));
}

// Set charset to prevent encoding issues
$conn->set_charset("utf8mb4");
?>