<?php
/**
 * Promarch Consulting - Admin Audit Activity Logs API
 */

require_once __DIR__ . '/../security.php';
require_once __DIR__ . '/../db.php';

$pdo = Database::getConnection();
requireAdminAuth($pdo);

try {
    $stmt = $pdo->query("SELECT * FROM admin_activity_logs ORDER BY created_at DESC LIMIT 100");
    $rows = $stmt->fetchAll();

    $logs = array_map(function($r) {
        return [
            'id'        => (string)$r['id'],
            'action'    => $r['action'],
            'jobId'     => $r['job_id'],
            'jobTitle'  => $r['job_title'],
            'details'   => $r['details'],
            'timestamp' => $r['created_at'],
            'user'      => $r['admin_user']
        ];
    }, $rows);

    sendResponse(true, $logs);
} catch (Exception $e) {
    sendResponse(false, [], 'Unable to fetch logs.', 500);
}
