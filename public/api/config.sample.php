<?php
/**
 * Promarch Consulting - Production Database Configuration
 * 
 * Keep this file private. Never commit real credentials to public source control.
 * Store outside public_html (recommended) or in public_html/api/ protected by .htaccess.
 * 
 * Hostinger MySQL Database Credentials:
 * Copy these exact values from Hostinger hPanel -> Databases -> Management
 */

// Prevent direct web execution/access even if webserver is misconfigured
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

// Database Connection Credentials (Placeholder template)
define('DB_HOST', 'YOUR_HOSTINGER_DB_HOST');
define('DB_NAME', 'YOUR_HOSTINGER_DB_NAME');
define('DB_USER', 'YOUR_HOSTINGER_DB_USER');
define('DB_PASS', 'YOUR_HOSTINGER_DB_PASSWORD');
define('DB_CHARSET', 'utf8mb4');
