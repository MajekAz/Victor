<?php
/**
 * Promarch Consulting - Public Vacancy REST API
 * Supports public vacancy search, filtering, slug retrieval, and metric counters.
 */

require_once __DIR__ . '/security.php';
require_once __DIR__ . '/db.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to format a database row into standard Job schema
function formatJobRow(array $row, array $tiers = []): array {
    $cleanArray = function($val) {
        if (empty($val)) return [];
        $decoded = is_string($val) ? json_decode($val, true) : $val;
        if (!is_array($decoded)) return [];
        return array_values(array_map('sanitizeString', array_filter($decoded)));
    };

    return [
        'id'               => $row['id'],
        'title'            => sanitizeString($row['title']),
        'slug'             => $row['slug'],
        'company'          => sanitizeString($row['company']),
        'companyLogo'      => $row['company_logo'] ?? '',
        'location'         => sanitizeString($row['location']),
        'city'             => sanitizeString($row['city'] ?? ''),
        'region'           => sanitizeString($row['region'] ?? ''),
        'country'          => sanitizeString($row['country'] ?? 'United Kingdom'),
        'postcode'         => sanitizeString($row['postcode'] ?? ''),
        'salaryMin'        => $row['salary_min'] !== null ? (float)$row['salary_min'] : null,
        'salaryMax'        => $row['salary_max'] !== null ? (float)$row['salary_max'] : null,
        'salaryText'       => sanitizeString($row['salary_text'] ?? ''),
        'salaryPeriod'     => $row['salary_period'] ?? 'per hour',
        'currency'         => $row['currency'] ?? '£',
        'jobType'          => sanitizeString($row['job_type'] ?? 'Contract'),
        'workArrangement'  => sanitizeString($row['work_arrangement'] ?? 'On-site'),
        'category'         => sanitizeString($row['category']),
        'shortDescription' => sanitizeString($row['short_description']),
        'fullDescription'  => sanitizeString($row['full_description'] ?? ''),
        'responsibilities' => $cleanArray($row['responsibilities'] ?? []),
        'requirements'     => $cleanArray($row['requirements'] ?? []),
        'qualifications'   => $cleanArray($row['qualifications'] ?? []),
        'experience'       => sanitizeString($row['experience'] ?? ''),
        'skills'           => $cleanArray($row['skills'] ?? []),
        'benefits'         => $cleanArray($row['benefits'] ?? []),
        'workingHours'     => sanitizeString($row['working_hours'] ?? ''),
        'jobCardCaption'   => !empty($row['job_card_caption']) ? sanitizeString($row['job_card_caption']) : null,
        'regionsMentioned' => sanitizeString($row['regions_mentioned'] ?? ''),
        'sourceName'       => sanitizeString($row['source_name'] ?? ''),
        'sourceUrl'        => $row['source_url'] ?? '',
        'applicationUrl'   => $row['application_url'] ?? '',
        'datePosted'       => $row['date_posted'] ?? $row['created_at'],
        'closingDate'      => $row['closing_date'] ?? null,
        'featured'         => (bool)$row['featured'],
        'status'           => $row['status'],
        'createdAt'        => $row['created_at'],
        'updatedAt'        => $row['updated_at'],
        'views'            => (int)($row['views'] ?? 0),
        'applyClicks'      => (int)($row['apply_clicks'] ?? 0),
        'salaryTiers'      => array_map(function($t) {
            return [
                'role'          => sanitizeString($t['role_label']),
                'hourlyRate'    => $t['hourly_rate'],
                'hours36Yearly' => $t['annual_36_hours'] ?? '',
                'hours48Yearly' => $t['annual_48_hours'] ?? '',
                'notes'         => sanitizeString($t['salary_notes'] ?? '')
            ];
        }, $tiers)
    ];
}

try {
    // ------------------------------------------------------------------------------
    // POST: Metric tracking (views and apply clicks)
    // ------------------------------------------------------------------------------
    if ($method === 'POST') {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true) ?? [];
        $action = $_GET['action'] ?? $data['action'] ?? '';
        $jobId = $_GET['id'] ?? $data['id'] ?? '';

        if (empty($jobId)) {
            sendResponse(false, null, 'Job ID is required.', 400);
        }

        if ($action === 'view') {
            $stmt = $pdo->prepare("UPDATE jobs SET views = views + 1 WHERE id = :id");
            $stmt->execute([':id' => $jobId]);
            sendResponse(true, ['incremented' => 'view']);
        } elseif ($action === 'apply') {
            $stmt = $pdo->prepare("UPDATE jobs SET apply_clicks = apply_clicks + 1 WHERE id = :id");
            $stmt->execute([':id' => $jobId]);
            sendResponse(true, ['incremented' => 'apply_click']);
        }

        sendResponse(false, null, 'Unknown action.', 400);
    }

    // ------------------------------------------------------------------------------
    // GET: Single vacancy by slug or ID (published only)
    // ------------------------------------------------------------------------------
    $slug = $_GET['slug'] ?? $_GET['id'] ?? null;
    if (!empty($slug)) {
        $stmt = $pdo->prepare("
            SELECT * FROM jobs 
            WHERE (slug = :slug OR id = :id) 
              AND status = 'published'
            LIMIT 1
        ");
        $stmt->execute([':slug' => $slug, ':id' => $slug]);
        $jobRow = $stmt->fetch();

        if (!$jobRow) {
            sendResponse(false, null, 'Vacancy not found or no longer active.', 404);
        }

        // Fetch salary tiers
        $tierStmt = $pdo->prepare("
            SELECT * FROM job_salary_tiers 
            WHERE job_id = :job_id 
            ORDER BY display_order ASC, id ASC
        ");
        $tierStmt->execute([':job_id' => $jobRow['id']]);
        $tiers = $tierStmt->fetchAll();

        // Increment view
        $pdo->prepare("UPDATE jobs SET views = views + 1 WHERE id = :id")->execute([':id' => $jobRow['id']]);

        sendResponse(true, formatJobRow($jobRow, $tiers));
    }

    // ------------------------------------------------------------------------------
    // GET: List published vacancies with filters, search, and pagination
    // ------------------------------------------------------------------------------
    $searchTerm       = trim($_GET['searchTerm'] ?? $_GET['keyword'] ?? '');
    $locationFilter   = trim($_GET['location'] ?? '');
    $jobTypeFilter    = trim($_GET['jobType'] ?? '');
    $arrangementFilter= trim($_GET['workArrangement'] ?? '');
    $categoryFilter   = trim($_GET['category'] ?? '');
    $minSalary        = isset($_GET['minSalary']) && is_numeric($_GET['minSalary']) ? (float)$_GET['minSalary'] : null;
    $sortBy           = trim($_GET['sortBy'] ?? 'newest');
    $page             = max(1, (int)($_GET['page'] ?? 1));
    $limit            = min(50, max(1, (int)($_GET['limit'] ?? 9)));
    $offset           = ($page - 1) * $limit;

    // Base query for published vacancies strictly
    $where = ["status = 'published'"];
    $params = [];

    // Search filter
    if ($searchTerm !== '') {
        $where[] = "(title LIKE :search OR short_description LIKE :search OR full_description LIKE :search OR category LIKE :search OR company LIKE :search)";
        $params[':search'] = '%' . $searchTerm . '%';
    }

    // Location filter
    if ($locationFilter !== '') {
        $where[] = "(location LIKE :loc OR city LIKE :loc OR region LIKE :loc)";
        $params[':loc'] = '%' . $locationFilter . '%';
    }

    // Job Type filter
    if ($jobTypeFilter !== '' && $jobTypeFilter !== 'all') {
        $where[] = "job_type = :job_type";
        $params[':job_type'] = $jobTypeFilter;
    }

    // Work Arrangement filter
    if ($arrangementFilter !== '' && $arrangementFilter !== 'all') {
        $where[] = "work_arrangement = :arrangement";
        $params[':arrangement'] = $arrangementFilter;
    }

    // Category filter (support clean category or legacy encoded variant)
    if ($categoryFilter !== '' && $categoryFilter !== 'all') {
        $cleanCat = sanitizeString($categoryFilter);
        $where[] = "(category = :category OR category = :cat_encoded OR category LIKE :cat_fuzzy)";
        $params[':category'] = $cleanCat;
        $params[':cat_encoded'] = str_replace('&', '&amp;', $cleanCat);
        $params[':cat_fuzzy'] = '%' . str_replace('&', '%', $cleanCat) . '%';
    }

    // Minimum Salary filter
    if ($minSalary !== null && $minSalary > 0) {
        $where[] = "(salary_max >= :min_salary OR salary_min >= :min_salary)";
        $params[':min_salary'] = $minSalary;
    }

    $whereClause = implode(' AND ', $where);

    // Sorting
    $orderBy = "featured DESC, date_posted DESC";
    if ($sortBy === 'oldest') {
        $orderBy = "featured DESC, date_posted ASC";
    } elseif ($sortBy === 'closing_soon') {
        $orderBy = "CASE WHEN closing_date IS NULL THEN 1 ELSE 0 END, closing_date ASC, date_posted DESC";
    } elseif ($sortBy === 'salary_high') {
        $orderBy = "salary_max DESC, salary_min DESC";
    } elseif ($sortBy === 'salary_low') {
        $orderBy = "salary_min ASC, salary_max ASC";
    }

    // 1. Get total count
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM jobs WHERE {$whereClause}");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // 2. Get distinct categories for filter bar (cleaned of any legacy encoded entities)
    $catStmt = $pdo->query("SELECT DISTINCT category FROM jobs WHERE status = 'published' AND category != '' ORDER BY category ASC");
    $rawCategories = $catStmt->fetchAll(PDO::FETCH_COLUMN);
    $cleanCategories = [];
    foreach ($rawCategories as $c) {
        $clean = sanitizeString($c);
        if ($clean !== '' && !in_array($clean, $cleanCategories, true)) {
            $cleanCategories[] = $clean;
        }
    }
    sort($cleanCategories);
    $categories = $cleanCategories;

    // 3. Fetch jobs page
    $sql = "SELECT * FROM jobs WHERE {$whereClause} ORDER BY {$orderBy} LIMIT {$limit} OFFSET {$offset}";
    $jobStmt = $pdo->prepare($sql);
    $jobStmt->execute($params);
    $jobRows = $jobStmt->fetchAll();

    // 4. Fetch salary tiers for matching jobs in bulk
    $formattedJobs = [];
    if (!empty($jobRows)) {
        $jobIds = array_column($jobRows, 'id');
        $placeholders = implode(',', array_fill(0, count($jobIds), '?'));
        $tierStmt = $pdo->prepare("SELECT * FROM job_salary_tiers WHERE job_id IN ({$placeholders}) ORDER BY display_order ASC, id ASC");
        $tierStmt->execute($jobIds);
        $allTiers = $tierStmt->fetchAll();

        $tiersByJob = [];
        foreach ($allTiers as $t) {
            $tiersByJob[$t['job_id']][] = $t;
        }

        foreach ($jobRows as $row) {
            $jobTiers = $tiersByJob[$row['id']] ?? [];
            $formattedJobs[] = formatJobRow($row, $jobTiers);
        }
    }

    sendResponse(true, [
        'jobs'       => $formattedJobs,
        'total'      => $total,
        'page'       => $page,
        'limit'      => $limit,
        'categories' => $categories
    ]);
} catch (Throwable $e) {
    error_log('Public jobs API error: ' . $e->getMessage());
    sendResponse(false, null, 'Unable to retrieve vacancies at this time. Please try again later.', 500);
}
