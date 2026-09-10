<?php
/**
 * Promarch Consulting - Admin Vacancies Management REST API
 * Secure server-side CRUD, salary tiers persistence, and audit logging.
 */

require_once __DIR__ . '/../security.php';
require_once __DIR__ . '/../db.php';

$pdo = Database::getConnection();

// Strict Admin Authorization Check (validates session, active db account status, and CSRF token on writes)
requireAdminAuth($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$user = $_SESSION['admin_user'] ?? 'Administrator';

// Audit Logger Helper
function logAdminActivity(PDO $pdo, string $action, ?string $jobId, ?string $jobTitle, string $details, string $user): void {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $stmt = $pdo->prepare("
            INSERT INTO admin_activity_logs (action, job_id, job_title, details, admin_user, ip_address, created_at)
            VALUES (:action, :job_id, :job_title, :details, :user, :ip, NOW())
        ");
        $stmt->execute([
            ':action'    => $action,
            ':job_id'    => $jobId,
            ':job_title' => $jobTitle,
            ':details'   => $details,
            ':user'      => $user,
            ':ip'        => $ip
        ]);
    } catch (Exception $e) {
        // Silently ignore logging errors
    }
}

// Fetch single job helper with tiers
function fetchAdminJob(PDO $pdo, string $id): ?array {
    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $row = $stmt->fetch();
    if (!$row) return null;

    $tierStmt = $pdo->prepare("SELECT * FROM job_salary_tiers WHERE job_id = :id ORDER BY display_order ASC, id ASC");
    $tierStmt->execute([':id' => $id]);
    $tiers = $tierStmt->fetchAll();

    return [
        'id'               => $row['id'],
        'title'            => $row['title'],
        'slug'             => $row['slug'],
        'company'          => $row['company'],
        'companyLogo'      => $row['company_logo'] ?? '',
        'location'         => $row['location'],
        'city'             => $row['city'] ?? '',
        'region'           => $row['region'] ?? '',
        'country'          => $row['country'] ?? 'United Kingdom',
        'postcode'         => $row['postcode'] ?? '',
        'salaryMin'        => $row['salary_min'] !== null ? (float)$row['salary_min'] : null,
        'salaryMax'        => $row['salary_max'] !== null ? (float)$row['salary_max'] : null,
        'salaryText'       => $row['salary_text'] ?? '',
        'salaryPeriod'     => $row['salary_period'] ?? 'per hour',
        'currency'         => $row['currency'] ?? '£',
        'jobType'          => $row['job_type'] ?? 'Contract',
        'workArrangement'  => $row['work_arrangement'] ?? 'On-site',
        'category'         => $row['category'],
        'shortDescription' => $row['short_description'],
        'fullDescription'  => $row['full_description'] ?? '',
        'responsibilities' => !empty($row['responsibilities']) ? json_decode($row['responsibilities'], true) : [],
        'requirements'     => !empty($row['requirements']) ? json_decode($row['requirements'], true) : [],
        'qualifications'   => !empty($row['qualifications']) ? json_decode($row['qualifications'], true) : [],
        'experience'       => $row['experience'] ?? '',
        'skills'           => !empty($row['skills']) ? json_decode($row['skills'], true) : [],
        'benefits'         => !empty($row['benefits']) ? json_decode($row['benefits'], true) : [],
        'workingHours'     => $row['working_hours'] ?? '',
        'regionsMentioned' => $row['regions_mentioned'] ?? '',
        'sourceName'       => $row['source_name'] ?? '',
        'sourceUrl'        => $row['source_url'] ?? '',
        'applicationUrl'   => $row['application_url'] ?? '',
        'datePosted'       => $row['date_posted'] ?? $row['created_at'],
        'closingDate'      => $row['closing_date'] ?? null,
        'featured'         => (bool)$row['featured'],
        'status'           => $row['status'],
        'createdAt'        => $row['created_at'],
        'updatedAt'        => $row['updated_at'],
        'createdBy'        => $row['created_by'] ?? '',
        'updatedBy'        => $row['updated_by'] ?? '',
        'views'            => (int)($row['views'] ?? 0),
        'applyClicks'      => (int)($row['apply_clicks'] ?? 0),
        'salaryTiers'      => array_map(function($t) {
            return [
                'role'          => $t['role_label'],
                'hourlyRate'    => $t['hourly_rate'],
                'hours36Yearly' => $t['annual_36_hours'] ?? '',
                'hours48Yearly' => $t['annual_48_hours'] ?? '',
                'notes'         => $t['salary_notes'] ?? ''
            ];
        }, $tiers)
    ];
}

// ------------------------------------------------------------------------------
// GET: Fetch all jobs for Admin Dashboard
// ------------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY updated_at DESC");
    $jobRows = $stmt->fetchAll();

    $jobIds = array_column($jobRows, 'id');
    $allTiers = [];
    if (!empty($jobIds)) {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $tierStmt = $pdo->prepare("SELECT * FROM job_salary_tiers WHERE job_id IN ({$placeholders}) ORDER BY display_order ASC, id ASC");
        $tierStmt->execute($jobIds);
        foreach ($tierStmt->fetchAll() as $t) {
            $allTiers[$t['job_id']][] = $t;
        }
    }

    $jobs = [];
    foreach ($jobRows as $row) {
        $tiers = $allTiers[$row['id']] ?? [];
        $jobs[] = [
            'id'               => $row['id'],
            'title'            => $row['title'],
            'slug'             => $row['slug'],
            'company'          => $row['company'],
            'companyLogo'      => $row['company_logo'] ?? '',
            'location'         => $row['location'],
            'city'             => $row['city'] ?? '',
            'region'           => $row['region'] ?? '',
            'country'          => $row['country'] ?? 'United Kingdom',
            'postcode'         => $row['postcode'] ?? '',
            'salaryMin'        => $row['salary_min'] !== null ? (float)$row['salary_min'] : null,
            'salaryMax'        => $row['salary_max'] !== null ? (float)$row['salary_max'] : null,
            'salaryText'       => $row['salary_text'] ?? '',
            'salaryPeriod'     => $row['salary_period'] ?? 'per hour',
            'currency'         => $row['currency'] ?? '£',
            'jobType'          => $row['job_type'] ?? 'Contract',
            'workArrangement'  => $row['work_arrangement'] ?? 'On-site',
            'category'         => $row['category'],
            'shortDescription' => $row['short_description'],
            'fullDescription'  => $row['full_description'] ?? '',
            'responsibilities' => !empty($row['responsibilities']) ? json_decode($row['responsibilities'], true) : [],
            'requirements'     => !empty($row['requirements']) ? json_decode($row['requirements'], true) : [],
            'qualifications'   => !empty($row['qualifications']) ? json_decode($row['qualifications'], true) : [],
            'experience'       => $row['experience'] ?? '',
            'skills'           => !empty($row['skills']) ? json_decode($row['skills'], true) : [],
            'benefits'         => !empty($row['benefits']) ? json_decode($row['benefits'], true) : [],
            'workingHours'     => $row['working_hours'] ?? '',
            'regionsMentioned' => $row['regions_mentioned'] ?? '',
            'sourceName'       => $row['source_name'] ?? '',
            'sourceUrl'        => $row['source_url'] ?? '',
            'applicationUrl'   => $row['application_url'] ?? '',
            'datePosted'       => $row['date_posted'] ?? $row['created_at'],
            'closingDate'      => $row['closing_date'] ?? null,
            'featured'         => (bool)$row['featured'],
            'status'           => $row['status'],
            'createdAt'        => $row['created_at'],
            'updatedAt'        => $row['updated_at'],
            'createdBy'        => $row['created_by'] ?? '',
            'updatedBy'        => $row['updated_by'] ?? '',
            'views'            => (int)($row['views'] ?? 0),
            'applyClicks'      => (int)($row['apply_clicks'] ?? 0),
            'salaryTiers'      => array_map(function($t) {
                return [
                    'role'          => $t['role_label'],
                    'hourlyRate'    => $t['hourly_rate'],
                    'hours36Yearly' => $t['annual_36_hours'] ?? '',
                    'hours48Yearly' => $t['annual_48_hours'] ?? '',
                    'notes'         => $t['salary_notes'] ?? ''
                ];
            }, $tiers)
        ];
    }

    sendResponse(true, $jobs);
}

// ------------------------------------------------------------------------------
// MUTATIONS (POST / PUT / DELETE)
// ------------------------------------------------------------------------------
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? [];
if (empty($action) && !empty($data['action'])) {
    $action = $data['action'];
}

// Helper to sanitize array of strings
function sanitizeJsonArray($items): string {
    if (is_string($items)) {
        $lines = array_filter(array_map('trim', explode("\n", $items)));
        return json_encode(array_values($lines), JSON_UNESCAPED_UNICODE);
    }
    if (is_array($items)) {
        return json_encode(array_values(array_filter($items)), JSON_UNESCAPED_UNICODE);
    }
    return json_encode([]);
}

// 1. DELETE JOB
if ($method === 'DELETE' || $action === 'delete') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    if (empty($id)) {
        sendResponse(false, null, 'Job ID is required for deletion.', 400);
    }

    $existing = fetchAdminJob($pdo, $id);
    if (!$existing) {
        sendResponse(false, null, 'Job not found.', 404);
    }

    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = :id");
    $stmt->execute([':id' => $id]);

    logAdminActivity($pdo, 'deleted', $id, $existing['title'], "Deleted vacancy '{$existing['title']}'", $user);
    sendResponse(true, ['deleted' => true, 'id' => $id], 'Vacancy deleted successfully.');
}

// 2. CREATE JOB
if ($action === 'create' || ($method === 'POST' && empty($action))) {
    $title = sanitizeString($data['title'] ?? '');
    if (empty($title)) {
        sendResponse(false, null, 'Job title is required.', 400);
    }

    $id = !empty($data['id']) ? sanitizeString($data['id']) : '';
    if (!empty($id)) {
        // Safe duplicate check: ensure supplied ID does not already exist
        $idCheck = $pdo->prepare("SELECT id FROM jobs WHERE id = :id LIMIT 1");
        $idCheck->execute([':id' => $id]);
        if ($idCheck->fetch()) {
            sendResponse(false, null, "A vacancy with ID '{$id}' already exists.", 409);
        }
    } else {
        $id = 'pm-job-' . time() . '-' . rand(100, 999);
    }

    $slug = !empty($data['slug']) ? sanitizeSlug($data['slug']) : sanitizeSlug($title . '-' . ($data['company'] ?? 'promarch'));

    // Check slug uniqueness
    $slugCheck = $pdo->prepare("SELECT id FROM jobs WHERE slug = :slug AND id != :id LIMIT 1");
    $slugCheck->execute([':slug' => $slug, ':id' => $id]);
    if ($slugCheck->fetch()) {
        $slug .= '-' . rand(1000, 9999);
    }

    $now = date('Y-m-d H:i:s');
    $closing = !empty($data['closingDate']) ? date('Y-m-d H:i:s', strtotime($data['closingDate'])) : null;

    $stmt = $pdo->prepare("
        INSERT INTO jobs (
            id, title, slug, company, company_logo, location, city, region, postcode, country,
            salary_min, salary_max, salary_text, salary_period, currency, job_type, work_arrangement,
            category, short_description, full_description, responsibilities, requirements, qualifications,
            experience, skills, benefits, working_hours, regions_mentioned, source_name, source_url,
            application_url, date_posted, closing_date, featured, status, created_at, updated_at,
            created_by, updated_by
        ) VALUES (
            :id, :title, :slug, :company, :company_logo, :location, :city, :region, :postcode, :country,
            :salary_min, :salary_max, :salary_text, :salary_period, :currency, :job_type, :work_arrangement,
            :category, :short_description, :full_description, :responsibilities, :requirements, :qualifications,
            :experience, :skills, :benefits, :working_hours, :regions_mentioned, :source_name, :source_url,
            :application_url, :date_posted, :closing_date, :featured, :status, :created_at, :updated_at,
            :created_by, :updated_by
        )
    ");

    $stmt->execute([
        ':id'                => $id,
        ':title'             => $title,
        ':slug'              => $slug,
        ':company'           => sanitizeString($data['company'] ?? 'Muve Healthcare'),
        ':company_logo'      => sanitizeString($data['companyLogo'] ?? ''),
        ':location'          => sanitizeString($data['location'] ?? 'United Kingdom'),
        ':city'              => sanitizeString($data['city'] ?? ''),
        ':region'            => sanitizeString($data['region'] ?? ''),
        ':postcode'          => sanitizeString($data['postcode'] ?? ''),
        ':country'           => sanitizeString($data['country'] ?? 'United Kingdom'),
        ':salary_min'        => !empty($data['salaryMin']) ? (float)$data['salaryMin'] : null,
        ':salary_max'        => !empty($data['salaryMax']) ? (float)$data['salaryMax'] : null,
        ':salary_text'       => sanitizeString($data['salaryText'] ?? ''),
        ':salary_period'     => sanitizeString($data['salaryPeriod'] ?? 'per hour'),
        ':currency'          => sanitizeString($data['currency'] ?? '£'),
        ':job_type'          => sanitizeString($data['jobType'] ?? 'Contract'),
        ':work_arrangement'  => sanitizeString($data['workArrangement'] ?? 'On-site'),
        ':category'          => sanitizeString($data['category'] ?? 'Healthcare & Social Care'),
        ':short_description' => sanitizeString($data['shortDescription'] ?? ''),
        ':full_description'  => $data['fullDescription'] ?? '',
        ':responsibilities'  => sanitizeJsonArray($data['responsibilities'] ?? []),
        ':requirements'      => sanitizeJsonArray($data['requirements'] ?? []),
        ':qualifications'    => sanitizeJsonArray($data['qualifications'] ?? []),
        ':experience'        => sanitizeString($data['experience'] ?? ''),
        ':skills'            => sanitizeJsonArray($data['skills'] ?? []),
        ':benefits'          => sanitizeJsonArray($data['benefits'] ?? []),
        ':working_hours'     => sanitizeString($data['workingHours'] ?? ''),
        ':regions_mentioned' => sanitizeString($data['regionsMentioned'] ?? ''),
        ':source_name'       => sanitizeString($data['sourceName'] ?? ''),
        ':source_url'        => sanitizeString($data['sourceUrl'] ?? ''),
        ':application_url'   => sanitizeString($data['applicationUrl'] ?? ''),
        ':date_posted'       => !empty($data['datePosted']) ? date('Y-m-d H:i:s', strtotime($data['datePosted'])) : $now,
        ':closing_date'      => $closing,
        ':featured'          => !empty($data['featured']) ? 1 : 0,
        ':status'            => sanitizeString($data['status'] ?? 'published'),
        ':created_at'        => $now,
        ':updated_at'        => $now,
        ':created_by'        => $user,
        ':updated_by'        => $user
    ]);

    // Insert Salary Tiers if provided
    if (!empty($data['salaryTiers']) && is_array($data['salaryTiers'])) {
        $tierInsert = $pdo->prepare("
            INSERT INTO job_salary_tiers (job_id, role_label, hourly_rate, annual_36_hours, annual_48_hours, salary_notes, display_order)
            VALUES (:job_id, :role, :hourly, :h36, :h48, :notes, :ord)
        ");
        $order = 1;
        foreach ($data['salaryTiers'] as $tier) {
            $tierInsert->execute([
                ':job_id' => $id,
                ':role'   => sanitizeString($tier['role'] ?? 'Standard Rate'),
                ':hourly' => sanitizeString($tier['hourlyRate'] ?? ''),
                ':h36'    => sanitizeString($tier['hours36Yearly'] ?? ''),
                ':h48'    => sanitizeString($tier['hours48Yearly'] ?? ''),
                ':notes'  => sanitizeString($tier['notes'] ?? ''),
                ':ord'    => $order++
            ]);
        }
    }

    logAdminActivity($pdo, 'created', $id, $title, "Created vacancy '{$title}'", $user);
    sendResponse(true, fetchAdminJob($pdo, $id), 'Vacancy created successfully.');
}

// 3. UPDATE JOB
if ($action === 'update' || $method === 'PUT' || $method === 'PATCH') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    if (empty($id)) {
        sendResponse(false, null, 'Job ID is required for update.', 400);
    }

    $existing = fetchAdminJob($pdo, $id);
    if (!$existing) {
        sendResponse(false, null, 'Job not found.', 404);
    }

    $title = sanitizeString($data['title'] ?? $existing['title']);
    $slug  = !empty($data['slug']) ? sanitizeSlug($data['slug']) : $existing['slug'];

    $stmt = $pdo->prepare("
        UPDATE jobs SET
            title = :title,
            slug = :slug,
            company = :company,
            company_logo = :company_logo,
            location = :location,
            city = :city,
            region = :region,
            postcode = :postcode,
            country = :country,
            salary_min = :salary_min,
            salary_max = :salary_max,
            salary_text = :salary_text,
            salary_period = :salary_period,
            currency = :currency,
            job_type = :job_type,
            work_arrangement = :work_arrangement,
            category = :category,
            short_description = :short_description,
            full_description = :full_description,
            responsibilities = :responsibilities,
            requirements = :requirements,
            qualifications = :qualifications,
            experience = :experience,
            skills = :skills,
            benefits = :benefits,
            working_hours = :working_hours,
            regions_mentioned = :regions_mentioned,
            source_name = :source_name,
            source_url = :source_url,
            application_url = :application_url,
            closing_date = :closing_date,
            featured = :featured,
            status = :status,
            updated_at = NOW(),
            updated_by = :updated_by
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'                => $id,
        ':title'             => $title,
        ':slug'              => $slug,
        ':company'           => sanitizeString($data['company'] ?? $existing['company']),
        ':company_logo'      => sanitizeString($data['companyLogo'] ?? $existing['companyLogo']),
        ':location'          => sanitizeString($data['location'] ?? $existing['location']),
        ':city'              => sanitizeString($data['city'] ?? $existing['city']),
        ':region'            => sanitizeString($data['region'] ?? $existing['region']),
        ':postcode'          => sanitizeString($data['postcode'] ?? $existing['postcode']),
        ':country'           => sanitizeString($data['country'] ?? $existing['country']),
        ':salary_min'        => isset($data['salaryMin']) ? (float)$data['salaryMin'] : $existing['salaryMin'],
        ':salary_max'        => isset($data['salaryMax']) ? (float)$data['salaryMax'] : $existing['salaryMax'],
        ':salary_text'       => sanitizeString($data['salaryText'] ?? $existing['salaryText']),
        ':salary_period'     => sanitizeString($data['salaryPeriod'] ?? $existing['salaryPeriod']),
        ':currency'          => sanitizeString($data['currency'] ?? $existing['currency']),
        ':job_type'          => sanitizeString($data['jobType'] ?? $existing['jobType']),
        ':work_arrangement'  => sanitizeString($data['workArrangement'] ?? $existing['workArrangement']),
        ':category'          => sanitizeString($data['category'] ?? $existing['category']),
        ':short_description' => sanitizeString($data['shortDescription'] ?? $existing['shortDescription']),
        ':full_description'  => $data['fullDescription'] ?? $existing['fullDescription'],
        ':responsibilities'  => isset($data['responsibilities']) ? sanitizeJsonArray($data['responsibilities']) : json_encode($existing['responsibilities']),
        ':requirements'      => isset($data['requirements']) ? sanitizeJsonArray($data['requirements']) : json_encode($existing['requirements']),
        ':qualifications'    => isset($data['qualifications']) ? sanitizeJsonArray($data['qualifications']) : json_encode($existing['qualifications']),
        ':experience'        => sanitizeString($data['experience'] ?? $existing['experience']),
        ':skills'            => isset($data['skills']) ? sanitizeJsonArray($data['skills']) : json_encode($existing['skills']),
        ':benefits'          => isset($data['benefits']) ? sanitizeJsonArray($data['benefits']) : json_encode($existing['benefits']),
        ':working_hours'     => sanitizeString($data['workingHours'] ?? $existing['workingHours']),
        ':regions_mentioned' => sanitizeString($data['regionsMentioned'] ?? $existing['regionsMentioned']),
        ':source_name'       => sanitizeString($data['sourceName'] ?? $existing['sourceName']),
        ':source_url'        => sanitizeString($data['sourceUrl'] ?? $existing['sourceUrl']),
        ':application_url'   => sanitizeString($data['applicationUrl'] ?? $existing['applicationUrl']),
        ':closing_date'      => !empty($data['closingDate']) ? date('Y-m-d H:i:s', strtotime($data['closingDate'])) : $existing['closingDate'],
        ':featured'          => isset($data['featured']) ? ($data['featured'] ? 1 : 0) : ($existing['featured'] ? 1 : 0),
        ':status'            => sanitizeString($data['status'] ?? $existing['status']),
        ':updated_by'        => $user
    ]);

    // If salary tiers provided, update them
    if (isset($data['salaryTiers']) && is_array($data['salaryTiers'])) {
        $pdo->prepare("DELETE FROM job_salary_tiers WHERE job_id = :id")->execute([':id' => $id]);
        $tierInsert = $pdo->prepare("
            INSERT INTO job_salary_tiers (job_id, role_label, hourly_rate, annual_36_hours, annual_48_hours, salary_notes, display_order)
            VALUES (:job_id, :role, :hourly, :h36, :h48, :notes, :ord)
        ");
        $order = 1;
        foreach ($data['salaryTiers'] as $tier) {
            $tierInsert->execute([
                ':job_id' => $id,
                ':role'   => sanitizeString($tier['role'] ?? 'Standard Rate'),
                ':hourly' => sanitizeString($tier['hourlyRate'] ?? ''),
                ':h36'    => sanitizeString($tier['hours36Yearly'] ?? ''),
                ':h48'    => sanitizeString($tier['hours48Yearly'] ?? ''),
                ':notes'  => sanitizeString($tier['notes'] ?? ''),
                ':ord'    => $order++
            ]);
        }
    }

    logAdminActivity($pdo, 'updated', $id, $title, "Updated vacancy '{$title}'", $user);
    sendResponse(true, fetchAdminJob($pdo, $id), 'Vacancy updated successfully.');
}

// 4. STATUS TOGGLE (publish / unpublish / archive)
if ($action === 'status') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    $newStatus = $data['status'] ?? '';
    $stmt = $pdo->prepare("UPDATE jobs SET status = :status, updated_at = NOW(), updated_by = :user WHERE id = :id");
    $stmt->execute([':status' => $newStatus, ':user' => $user, ':id' => $id]);
    logAdminActivity($pdo, 'status_change', $id, null, "Changed status to '{$newStatus}'", $user);
    sendResponse(true, fetchAdminJob($pdo, $id), 'Status updated successfully.');
}

// 5. FEATURE TOGGLE
if ($action === 'feature') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    $featured = !empty($data['featured']) ? 1 : 0;
    $stmt = $pdo->prepare("UPDATE jobs SET featured = :featured, updated_at = NOW(), updated_by = :user WHERE id = :id");
    $stmt->execute([':featured' => $featured, ':user' => $user, ':id' => $id]);
    logAdminActivity($pdo, $featured ? 'featured' : 'unfeatured', $id, null, ($featured ? 'Featured' : 'Unfeatured') . " vacancy", $user);
    sendResponse(true, fetchAdminJob($pdo, $id), 'Featured status updated.');
}

// 6. DUPLICATE JOB
if ($action === 'duplicate') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    $existing = fetchAdminJob($pdo, $id);
    if (!$existing) sendResponse(false, null, 'Job not found.', 404);

    $newId = 'pm-job-' . time() . '-' . rand(100, 999);
    $newTitle = $existing['title'] . ' (Copy)';
    $newSlug = sanitizeSlug($newTitle . '-' . time());

    $data['id'] = $newId;
    $data['title'] = $newTitle;
    $data['slug'] = $newSlug;
    $data['status'] = 'draft';
    $data['featured'] = false;
    $data['datePosted'] = date('Y-m-d H:i:s');
    $data['closingDate'] = null;

    // Call create logic
    $rawInput = json_encode($data);
    $_GET['action'] = 'create';
    // Forward to creation
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare("
        INSERT INTO jobs (
            id, title, slug, company, company_logo, location, city, region, postcode, country,
            salary_min, salary_max, salary_text, salary_period, currency, job_type, work_arrangement,
            category, short_description, full_description, responsibilities, requirements, qualifications,
            experience, skills, benefits, working_hours, regions_mentioned, source_name, source_url,
            application_url, date_posted, closing_date, featured, status, created_at, updated_at,
            created_by, updated_by
        ) VALUES (
            :id, :title, :slug, :company, :company_logo, :location, :city, :region, :postcode, :country,
            :salary_min, :salary_max, :salary_text, :salary_period, :currency, :job_type, :work_arrangement,
            :category, :short_description, :full_description, :responsibilities, :requirements, :qualifications,
            :experience, :skills, :benefits, :working_hours, :regions_mentioned, :source_name, :source_url,
            :application_url, :date_posted, :closing_date, :featured, :status, :created_at, :updated_at,
            :created_by, :updated_by
        )
    ");
    $stmt->execute([
        ':id'                => $newId,
        ':title'             => $newTitle,
        ':slug'              => $newSlug,
        ':company'           => $existing['company'],
        ':company_logo'      => $existing['companyLogo'],
        ':location'          => $existing['location'],
        ':city'              => $existing['city'],
        ':region'            => $existing['region'],
        ':postcode'          => $existing['postcode'],
        ':country'           => $existing['country'],
        ':salary_min'        => $existing['salaryMin'],
        ':salary_max'        => $existing['salaryMax'],
        ':salary_text'       => $existing['salaryText'],
        ':salary_period'     => $existing['salaryPeriod'],
        ':currency'          => $existing['currency'],
        ':job_type'          => $existing['jobType'],
        ':work_arrangement'  => $existing['workArrangement'],
        ':category'          => $existing['category'],
        ':short_description' => $existing['shortDescription'],
        ':full_description'  => $existing['fullDescription'],
        ':responsibilities'  => json_encode($existing['responsibilities']),
        ':requirements'      => json_encode($existing['requirements']),
        ':qualifications'    => json_encode($existing['qualifications']),
        ':experience'        => $existing['experience'],
        ':skills'            => json_encode($existing['skills']),
        ':benefits'          => json_encode($existing['benefits']),
        ':working_hours'     => $existing['workingHours'],
        ':regions_mentioned' => $existing['regionsMentioned'],
        ':source_name'       => $existing['sourceName'],
        ':source_url'        => $existing['sourceUrl'],
        ':application_url'   => $existing['applicationUrl'],
        ':date_posted'       => $now,
        ':closing_date'      => null,
        ':featured'          => 0,
        ':status'            => 'draft',
        ':created_at'        => $now,
        ':updated_at'        => $now,
        ':created_by'        => $user,
        ':updated_by'        => $user
    ]);

    // Copy salary tiers
    if (!empty($existing['salaryTiers'])) {
        $tierInsert = $pdo->prepare("
            INSERT INTO job_salary_tiers (job_id, role_label, hourly_rate, annual_36_hours, annual_48_hours, salary_notes, display_order)
            VALUES (:job_id, :role, :hourly, :h36, :h48, :notes, :ord)
        ");
        $order = 1;
        foreach ($existing['salaryTiers'] as $tier) {
            $tierInsert->execute([
                ':job_id' => $newId,
                ':role'   => $tier['role'],
                ':hourly' => $tier['hourlyRate'],
                ':h36'    => $tier['hours36Yearly'],
                ':h48'    => $tier['hours48Yearly'],
                ':notes'  => $tier['notes'],
                ':ord'    => $order++
            ]);
        }
    }

    logAdminActivity($pdo, 'duplicated', $newId, $newTitle, "Duplicated from vacancy '{$existing['title']}'", $user);
    sendResponse(true, fetchAdminJob($pdo, $newId), 'Vacancy duplicated successfully.');
}

// 7. RENEW JOB
if ($action === 'renew') {
    $id = $_GET['id'] ?? $data['id'] ?? '';
    $additionalDays = (int)($data['additionalDays'] ?? 30);
    $newClosing = date('Y-m-d H:i:s', time() + ($additionalDays * 86400));
    $stmt = $pdo->prepare("UPDATE jobs SET closing_date = :closing, status = 'published', updated_at = NOW(), updated_by = :user WHERE id = :id");
    $stmt->execute([':closing' => $newClosing, ':user' => $user, ':id' => $id]);
    logAdminActivity($pdo, 'renewed', $id, null, "Renewed vacancy (+{$additionalDays} days)", $user);
    sendResponse(true, fetchAdminJob($pdo, $id), 'Vacancy renewed successfully.');
}

// 8. BULK ACTIONS
if ($action === 'bulk') {
    $jobIds = $data['jobIds'] ?? [];
    $bulkAction = $data['bulkAction'] ?? '';

    if (empty($jobIds) || !is_array($jobIds)) {
        sendResponse(false, null, 'Job IDs array is required.', 400);
    }

    $count = 0;
    if ($bulkAction === 'delete') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("DELETE FROM jobs WHERE id IN ({$placeholders})");
        $stmt->execute($jobIds);
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_delete', null, null, "Bulk deleted {$count} vacancies", $user);
    } elseif ($bulkAction === 'publish') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("UPDATE jobs SET status = 'published', updated_at = NOW(), updated_by = ? WHERE id IN ({$placeholders})");
        $stmt->execute(array_merge([$user], $jobIds));
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_publish', null, null, "Bulk published {$count} vacancies", $user);
    } elseif ($bulkAction === 'unpublish') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("UPDATE jobs SET status = 'draft', updated_at = NOW(), updated_by = ? WHERE id IN ({$placeholders})");
        $stmt->execute(array_merge([$user], $jobIds));
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_unpublish', null, null, "Bulk unpublished {$count} vacancies", $user);
    } elseif ($bulkAction === 'archive') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("UPDATE jobs SET status = 'archived', updated_at = NOW(), updated_by = ? WHERE id IN ({$placeholders})");
        $stmt->execute(array_merge([$user], $jobIds));
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_archive', null, null, "Bulk archived {$count} vacancies", $user);
    } elseif ($bulkAction === 'feature') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("UPDATE jobs SET featured = 1, updated_at = NOW(), updated_by = ? WHERE id IN ({$placeholders})");
        $stmt->execute(array_merge([$user], $jobIds));
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_feature', null, null, "Bulk featured {$count} vacancies", $user);
    } elseif ($bulkAction === 'unfeature') {
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $stmt = $pdo->prepare("UPDATE jobs SET featured = 0, updated_at = NOW(), updated_by = ? WHERE id IN ({$placeholders})");
        $stmt->execute(array_merge([$user], $jobIds));
        $count = $stmt->rowCount();
        logAdminActivity($pdo, 'bulk_unfeature', null, null, "Bulk unfeatured {$count} vacancies", $user);
    }

    sendResponse(true, ['affectedCount' => $count], "Bulk action '{$bulkAction}' completed.");
}

sendResponse(false, null, 'Unrecognized request action.', 400);
