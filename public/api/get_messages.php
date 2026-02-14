<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

// SECURITY CHECK
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

// Check if table exists
$checkTable = $conn->query("SHOW TABLES LIKE 'contact_messages'");
if ($checkTable->num_rows == 0) {
    echo json_encode([]);
    exit();
}

$sql = "SELECT * FROM contact_messages ORDER BY id DESC";
$result = $conn->query($sql);

$messages = array();
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}
echo json_encode($messages);
$conn->close();
?>