<?php
// Ensure no output happens before headers
ob_start();
include_once __DIR__ . '/db_connect.php';
require_once __DIR__ . '/config.php'; 

header("Content-Type: application/json");

// Clear any accidental output from includes
if (ob_get_length()) ob_clean();

$input = file_get_contents("php://input");
$data = json_decode($input);

if (!$data) {
    echo json_encode(["success" => false, "error" => "Malformed request body."]);
    exit();
}

// $admin_password comes from config.php
if (isset($data->password) && !empty($data->password) && $data->password === $admin_password) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(["success" => true, "message" => "Authorization verified."]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized: Incorrect access credentials."]);
}

$conn->close();
?>