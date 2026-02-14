<?php
include_once __DIR__ . '/db_connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if(isset($data->name) && isset($data->email)) {
    $name = $conn->real_escape_string($data->name);
    $email = $conn->real_escape_string($data->email);
    $subject = isset($data->subject) ? $conn->real_escape_string($data->subject) : 'No Subject';
    $message = isset($data->message) ? $conn->real_escape_string($data->message) : '';
    $created_at = date('Y-m-d H:i:s');

    // Create table if not exists
    $table_sql = "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        subject VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->query($table_sql);

    // Insert into Database
    $sql = "INSERT INTO contact_messages (name, email, subject, message, created_at)
            VALUES ('$name', '$email', '$subject', '$message', '$created_at')";

    if ($conn->query($sql) === TRUE) {
        // --- SEND EMAIL NOTIFICATION ---
        $to = "info@promarchconsulting.co.uk";
        $email_subject = "New Inquiry: " . $data->subject; // Use original un-escaped subject for email
        
        $email_body = "You have received a new message from your website contact form.\n\n";
        $email_body .= "Name: " . $data->name . "\n";
        $email_body .= "Email: " . $data->email . "\n";
        $email_body .= "Subject: " . $data->subject . "\n\n";
        $email_body .= "Message:\n" . $data->message . "\n";
        
        // Headers
        // Using a generic domain address for 'From' improves deliverability
        // The user's email is set as 'Reply-To' so you can hit reply directly.
        $headers = "From: info@promarchconsulting.co.uk\r\n";
        $headers .= "Reply-To: " . $data->email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send
        mail($to, $email_subject, $email_body, $headers);
        // -------------------------------

        echo json_encode(["message" => "Message sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Incomplete data"]);
}
$conn->close();
?>