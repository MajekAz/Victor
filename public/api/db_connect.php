<?php
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
$pass = "2Akeem@68"; 
$dbname = "u123379735_Victor";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    header("HTTP/1.1 500 Internal Server Error");
    header("Content-Type: application/json");
    die(json_encode(["error" => "Database connection failed"]));
}
?>