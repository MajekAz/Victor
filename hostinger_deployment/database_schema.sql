-- ==============================================================================
-- Promarch Consulting - Production MySQL Database Schema & Migration
-- Target: Hostinger MySQL / MariaDB
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. Table: admin_users
-- Real server-side authentication using PHP password_hash() (bcrypt/argon2id)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table: jobs
-- Core vacancy repository. Slug is unique. Rich metadata supported.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `company` VARCHAR(255) NOT NULL DEFAULT 'Muve Healthcare',
  `company_logo` VARCHAR(500) NULL,
  `location` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NULL,
  `region` VARCHAR(255) NULL,
  `postcode` VARCHAR(50) NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'United Kingdom',
  `salary_min` DECIMAL(10, 2) NULL,
  `salary_max` DECIMAL(10, 2) NULL,
  `salary_text` VARCHAR(150) NULL,
  `salary_period` VARCHAR(50) NOT NULL DEFAULT 'per hour',
  `currency` VARCHAR(10) NOT NULL DEFAULT '£',
  `job_type` VARCHAR(50) NOT NULL DEFAULT 'Contract',
  `work_arrangement` VARCHAR(50) NOT NULL DEFAULT 'On-site',
  `category` VARCHAR(100) NOT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` MEDIUMTEXT NULL,
  `responsibilities` LONGTEXT NULL COMMENT 'Stored as JSON array',
  `requirements` LONGTEXT NULL COMMENT 'Stored as JSON array',
  `qualifications` LONGTEXT NULL COMMENT 'Stored as JSON array',
  `experience` TEXT NULL,
  `skills` LONGTEXT NULL COMMENT 'Stored as JSON array',
  `benefits` LONGTEXT NULL COMMENT 'Stored as JSON array',
  `working_hours` VARCHAR(255) NULL,
  `regions_mentioned` VARCHAR(255) NULL,
  `source_name` VARCHAR(255) NULL,
  `source_url` VARCHAR(500) NULL,
  `application_url` VARCHAR(500) NULL,
  `date_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closing_date` DATETIME NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(20) NOT NULL DEFAULT 'published' COMMENT 'published, draft, archived, expired',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` VARCHAR(100) NULL,
  `updated_by` VARCHAR(100) NULL,
  `views` INT NOT NULL DEFAULT 0,
  `apply_clicks` INT NOT NULL DEFAULT 0,
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_slug` (`slug`),
  INDEX `idx_jobs_date_posted` (`date_posted`),
  INDEX `idx_jobs_closing_date` (`closing_date`),
  INDEX `idx_jobs_category` (`category`),
  INDEX `idx_jobs_job_type` (`job_type`),
  INDEX `idx_jobs_location` (`location`),
  INDEX `idx_jobs_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table: job_salary_tiers
-- Preserves rich multi-tier healthcare salary rates without collapsing numbers
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_salary_tiers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` VARCHAR(64) NOT NULL,
  `role_label` VARCHAR(255) NOT NULL,
  `hourly_rate` VARCHAR(100) NOT NULL,
  `annual_36_hours` VARCHAR(100) NULL,
  `annual_48_hours` VARCHAR(100) NULL,
  `salary_notes` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  INDEX `idx_salary_tiers_job_id` (`job_id`),
  CONSTRAINT `fk_job_salary_tiers_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table: admin_activity_logs
-- Persistent audit log for vacancy changes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(50) NOT NULL,
  `job_id` VARCHAR(64) NULL,
  `job_title` VARCHAR(255) NULL,
  `details` TEXT NULL,
  `admin_user` VARCHAR(100) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_logs_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table: login_attempts
-- Server-side brute force rate limiting for administrative endpoints
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(45) NOT NULL,
  `attempted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_login_ip_time` (`ip_address`, `attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Table: contact_messages (Existing website compatibility)
-- Preserves contact form submissions from Promarch Consulting website
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 7. SEED DATA: The Two Genuine Muve Healthcare Vacancies
-- Note: Zero demo vacancies are seeded. All existing rate tiers are preserved.
-- ==============================================================================

-- Vacancy 1: Healthcare Support Worker / Complex Support Worker
INSERT INTO `jobs` (
  `id`,
  `title`,
  `slug`,
  `company`,
  `company_logo`,
  `location`,
  `city`,
  `region`,
  `postcode`,
  `country`,
  `salary_min`,
  `salary_max`,
  `salary_text`,
  `salary_period`,
  `currency`,
  `job_type`,
  `work_arrangement`,
  `category`,
  `short_description`,
  `full_description`,
  `responsibilities`,
  `requirements`,
  `qualifications`,
  `experience`,
  `skills`,
  `benefits`,
  `working_hours`,
  `regions_mentioned`,
  `source_name`,
  `source_url`,
  `application_url`,
  `date_posted`,
  `closing_date`,
  `featured`,
  `status`,
  `created_at`,
  `updated_at`,
  `created_by`,
  `updated_by`,
  `views`,
  `apply_clicks`
) VALUES (
  'muve-job-001',
  'Healthcare Support Worker / Complex Support Worker',
  'healthcare-support-worker-complex-support-worker-muve-healthcare',
  'Muve Healthcare',
  '',
  'United Kingdom – Nationwide',
  '',
  'Nationwide (England, Scotland, Wales and Northern Ireland)',
  '',
  'United Kingdom',
  14.50,
  16.00,
  '£14.50 – £16.00 per hour',
  'per hour',
  '£',
  'Contract',
  'On-site',
  'Healthcare & Social Care',
  'Muve Healthcare is recruiting Support Workers and Complex Support Workers as part of a new cohort of Local Authority and ICB direct-award contracts. Opportunities are available across a range of healthcare and complex-support settings throughout the UK.',
  'Muve Healthcare is mobilising a new cohort of Local Authority and ICB direct-award contracts and is recruiting healthcare professionals and support staff for opportunities across the United Kingdom.\n\nSupport opportunities cover areas including Mental Health, Learning Disabilities, Autism, Complex Care, Positive Behaviour Support, 3:1 and 4:1 support, tracheostomy, ventilation, PEG, PICU and ICU environments.\n\nAvailable contract options include 36-hour and 48-hour arrangements.',
  '[\"Mental Health (MH)\", \"Learning Disabilities (LD)\", \"Autism\", \"Complex Care\", \"Positive Behaviour Support (PBS)\", \"3:1 / 4:1 Support\", \"Tracheostomy\", \"Ventilation\", \"PEG\", \"PICU\", \"ICU\"]',
  '[\"Previous experience in healthcare, support work, or care environments\", \"Right to work in the UK\", \"Commitment to high standards of patient care\", \"Clear Enhanced DBS check (or willing to obtain)\"]',
  '[\"Care Certificate or NVQ/QCF Level 2/3 in Health and Social Care (or equivalent / working towards)\", \"Mandatory healthcare training certificates\"]',
  'Demonstrated experience supporting individuals with complex needs, learning disabilities, mental health or physical healthcare requirements.',
  '[\"Mental Health Support\", \"Learning Disabilities\", \"Autism Care\", \"Complex Care\", \"Positive Behaviour Support (PBS)\", \"3:1 / 4:1 Support\", \"Tracheostomy Care\", \"Ventilation\", \"PEG Feeding\", \"PICU\", \"ICU\"]',
  '[\"Weekly pay\", \"Consistent work opportunities\", \"36 and 48-hour contracts\", \"Rotas available up to 6 months in advance\", \"App-based rota management\", \"Digital care planning\", \"Internal training and development\", \"24/7 MDT support\", \"Support across CAMHS, RMN/RNLD, PICU, ICU, PBS, Service Management and Quality/Governance\"]',
  '36-hour and 48-hour contracts available',
  'England, Scotland, Wales and Northern Ireland',
  'Muve Healthcare recruitment information supplied to Promarch Consulting',
  '',
  '',
  '2026-09-09 09:00:00',
  NULL,
  1,
  'published',
  '2026-09-09 09:00:00',
  '2026-09-09 09:00:00',
  'Muve Healthcare',
  'Muve Healthcare',
  0,
  0
) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Salary Tiers for Vacancy 1
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`) VALUES
('muve-job-001', 'Support Worker', '£14.50 / hour', '£27,144 / year', '£36,192 / year', 'Weekly pay. 36h: £27,144/yr | 48h: £36,192/yr', 1),
('muve-job-001', 'Complex Support Worker', '£16.00 / hour', '£29,952 / year', '£39,936 / year', 'Weekly pay. 36h: £29,952/yr | 48h: £39,936/yr', 2);

-- Vacancy 2: Registered Nurse – RGN / RMN / RNLD / ICU / RCN
INSERT INTO `jobs` (
  `id`,
  `title`,
  `slug`,
  `company`,
  `company_logo`,
  `location`,
  `city`,
  `region`,
  `postcode`,
  `country`,
  `salary_min`,
  `salary_max`,
  `salary_text`,
  `salary_period`,
  `currency`,
  `job_type`,
  `work_arrangement`,
  `category`,
  `short_description`,
  `full_description`,
  `responsibilities`,
  `requirements`,
  `qualifications`,
  `experience`,
  `skills`,
  `benefits`,
  `working_hours`,
  `regions_mentioned`,
  `source_name`,
  `source_url`,
  `application_url`,
  `date_posted`,
  `closing_date`,
  `featured`,
  `status`,
  `created_at`,
  `updated_at`,
  `created_by`,
  `updated_by`,
  `views`,
  `apply_clicks`
) VALUES (
  'muve-job-002',
  'Registered Nurse – RGN / RMN / RNLD / ICU / RCN',
  'registered-nurse-rgn-rmn-rnld-icu-rcn-muve-healthcare',
  'Muve Healthcare',
  '',
  'United Kingdom – Nationwide',
  '',
  'Nationwide (England, Scotland, Wales and Northern Ireland)',
  '',
  'United Kingdom',
  25.00,
  27.00,
  '£25.00 – £27.00 per hour',
  'per hour',
  '£',
  'Contract',
  'On-site',
  'Healthcare & Nursing',
  'Muve Healthcare is recruiting registered nurses across RGN, RMN, RNLD, ICU and RCN roles as part of a new cohort of Local Authority and ICB direct-award contracts, with healthcare opportunities available across the UK.',
  'Muve Healthcare is mobilising a new cohort of Local Authority and ICB direct-award contracts and is recruiting qualified nursing professionals across a range of healthcare settings.\n\nCurrent nursing opportunities include RGN, RMN, RNLD, ICU and RCN roles, with services covering areas including Mental Health, Learning Disabilities, Complex Care, Positive Behaviour Support, PICU and ICU.\n\nAvailable contract options include 36-hour and 48-hour arrangements.',
  '[\"RGN\", \"RMN\", \"RNLD\", \"ICU\", \"RCN\", \"Mental Health\", \"Learning Disabilities\", \"PICU\", \"Complex Care\", \"Positive Behaviour Support\"]',
  '[\"Current NMC Registration with valid PIN\", \"Relevant UK nursing qualification (RGN, RMN, RNLD, or RCN)\", \"Enhanced DBS on the update service (or willing to obtain)\", \"Right to work in the UK\"]',
  '[\"BSc / Diploma in Nursing\", \"Valid NMC PIN (Registered General Nurse, Registered Mental Health Nurse, Registered Learning Disability Nurse, or Registered Children\'s Nurse)\"]',
  'Clinical nursing experience within acute, mental health, ICU/PICU, or complex community nursing environments.',
  '[\"RGN Nursing\", \"RMN (Mental Health)\", \"RNLD (Learning Disabilities)\", \"ICU Nursing\", \"RCN (Children\'s Nursing)\", \"Mental Health Care\", \"Learning Disabilities Support\", \"Complex Care\", \"Positive Behaviour Support (PBS)\", \"PICU Care\"]',
  '[\"Weekly pay\", \"Consistent work opportunities\", \"36 and 48-hour contracts\", \"Rotas available up to 6 months in advance\", \"App-based rota management\", \"Digital care planning\", \"Internal training and development\", \"24/7 MDT support\", \"Support across CAMHS, RMN/RNLD, PICU, ICU, PBS, Service Management and Quality/Governance\"]',
  '36-hour and 48-hour contracts available',
  'England, Scotland, Wales and Northern Ireland',
  'Muve Healthcare recruitment information supplied to Promarch Consulting',
  '',
  '',
  '2026-09-09 09:00:00',
  NULL,
  1,
  'published',
  '2026-09-09 09:00:00',
  '2026-09-09 09:00:00',
  'Muve Healthcare',
  'Muve Healthcare',
  0,
  0
) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Salary Tiers for Vacancy 2
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`) VALUES
('muve-job-002', 'RGN / RMN / RNLD', '£25.00 / hour', '£46,800 / year', '£62,400 / year', 'Weekly pay. 36h: £46,800/yr | 48h: £62,400/yr', 1),
('muve-job-002', 'ICU / RCN', '£27.00 / hour', '£50,544 / year', '£67,392 / year', 'Weekly pay. 36h: £50,544/yr | 48h: £67,392/yr', 2);

-- ------------------------------------------------------------------------------
-- 8. Administrator Accounts
-- Note: Zero default or hard-coded administrator credentials are seeded.
-- To create your first administrator securely with a bespoke password,
-- run the one-time setup tool:
--   CLI: php setup_admin.php
--   Web: https://promarchconsulting.co.uk/api/setup_admin.php
-- ------------------------------------------------------------------------------

