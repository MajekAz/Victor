<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

// SECURITY CHECK
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    $id = intval($data->id);
    $sql = "DELETE FROM contact_messages WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting"]);
    }
}
$conn->close();
?>