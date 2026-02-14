<?php
include_once __DIR__ . '/db_connect.php';
// Ensure config is loaded (db_connect loads it, but we use require_once to be safe and access vars)
require_once __DIR__ . '/config.php'; 

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

// $admin_password comes from config.php
if (isset($data->password) && $data->password === $admin_password) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(["success" => true, "message" => "Logged in"]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid password"]);
}
$conn->close();
?>