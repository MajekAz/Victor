<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

session_unset();
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out"]);
?>