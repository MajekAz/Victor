<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

// CHANGE YOUR PASSWORD HERE
$admin_password = "Victor@2026"; 

if (isset($data->password) && $data->password === $admin_password) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(["success" => true, "message" => "Logged in"]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid password"]);
}
$conn->close();
?>