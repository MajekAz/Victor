<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't output errors to JSON stream

// Load Configuration
if (!file_exists(__DIR__ . '/config.php')) {
    header("HTTP/1.1 500 Internal Server Error");
    die(json_encode(["error" => "Configuration file missing. Please rename config.sample.php to config.php and set credentials."]));
}
require_once __DIR__ . '/config.php';

// Determine if HTTPS is enabled
$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;

// Start secure session handling
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '', 
    'secure' => $isSecure, 
    'httponly' => true,
    'samesite' => 'None' 
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

// Use variables from config.php
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: application/json");
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}
?>