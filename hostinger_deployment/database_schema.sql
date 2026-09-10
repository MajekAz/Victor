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

-- Vacancy 3: Digital Transformation Manager (Veolia)
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
  'veolia-job-001',
  'Digital Transformation Manager',
  'digital-transformation-manager-haringey-london',
  'Veolia',
  '',
  'Haringey, London',
  'London',
  'Greater London',
  '',
  'United Kingdom',
  35000.00,
  35000.00,
  '£35,000 per annum plus enhanced pension and Veolia benefits',
  'per year',
  '£',
  'Full-time',
  'Hybrid',
  'Digital / Technology',
  'Veolia is seeking a Digital Transformation Manager for a 12-month fixed-term contract based in Haringey, London. The role focuses on using data, digital systems and technology to improve operational efficiency, automate back-office processes and support digital transformation across customer sites.',
  'Salary: £35,000 per annum plus enhanced pension and Veolia benefits.\n\nHours: 40 hours per week.\n\nContract: 12-month fixed-term contract / secondment.\n\nLocation: Haringey, London, with occasional travel to other depots in the region and hybrid working.\n\nVeolia is looking for a Digital Transformation Manager who can help operational teams make better use of data and technology while reducing the administrative burden created by manual and paper-based processes.\n\nThe successful candidate will work across customer sites and alongside onsite management teams to improve the quality, accessibility and practical use of operational data.\n\nThe role will focus on identifying opportunities to automate back-office processes, improve existing digital systems and support the introduction of new technology.\n\nAdditional Information:\nVeolia states that it is committed to creating an inclusive workplace and supporting applicants who may require reasonable adjustments during the recruitment process.\n\nThe company participates in the Disability Confident scheme and states that qualifying applicants who opt into the scheme and meet the minimum role criteria may be offered an interview.\n\nApplication:\nCandidates are registering their interest through Promarch Consulting.',
  '[\"Own and rethink back-office processes to remove unnecessary paper-based processes and administrative activity.\", \"Support national digital and operational project rollouts.\", \"Deliver product roadmaps with support from the central operational systems team.\", \"Work closely with operational teams to improve how data and reporting are used.\", \"Identify opportunities to improve service efficiency and operational performance.\", \"Use existing and emerging technologies to optimise processes.\", \"Develop and implement technology supporting the digitisation of services.\", \"Help automate operational processes wherever practical.\", \"Support implementation of the organisation\'s digital training strategy.\", \"Deliver or support operational end-user training.\", \"Support service changes designed to improve efficiency.\", \"Use spatial and GIS technology to support routing and service improvements.\", \"Manipulate and analyse large datasets.\", \"Perform service analysis using operational systems.\"]',
  '[\"Proven experience in operational or analytical management supporting business change.\", \"Strong problem-solving ability.\", \"Ability to work independently.\", \"Strong relationship-management skills.\", \"Excellent communication skills.\", \"Ability to explain complex information and data analysis clearly to non-technical users.\", \"Strong data-analysis skills.\", \"Strong Excel and/or Google Sheets skills.\"]',
  '[\"Relevant operational, analytical, or technical background supporting business change.\", \"Demonstrated experience in process digitisation and automation.\"]',
  'Proven experience in operational or analytical management supporting business change.',
  '[\"Digital Transformation\", \"Process Automation\", \"Data Analysis\", \"Operational Systems\", \"GIS & Spatial Technology\", \"Excel / Google Sheets\", \"Service Analysis\", \"Change Management\"]',
  '[\"Access to the company pension scheme.\", \"Discounts with grocery stores and well-known retailers.\", \"Resources supporting physical, mental and financial wellbeing.\", \"24-hour virtual GP access, 365 days per year, including eligible household family members.\", \"One paid volunteering day each year.\", \"Ongoing training and development opportunities.\", \"Employee financial wellbeing support through Stream.\", \"Early access to earned pay.\", \"Savings and budgeting support.\", \"Financial coaching and rewards.\"]',
  '40 hours per week (12-month Fixed Term Contract)',
  'Haringey, Greater London',
  'Veolia',
  '',
  '',
  '2026-09-09 09:00:00',
  '2026-11-08 23:59:59',
  0,
  'published',
  '2026-09-09 09:00:00',
  '2026-09-09 09:00:00',
  'Veolia',
  'Veolia',
  0,
  0
) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Salary Tier for Vacancy 3
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`) VALUES
('veolia-job-001', 'Digital Transformation Manager', '£35,000 / year', '£35,000 / year', '£35,000 / year', '£35,000 per annum plus enhanced pension and Veolia benefits', 1);

-- Vacancy 4: Management Accountant (Alderstone Business Services)
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
  'alderstone-job-001',
  'Management Accountant',
  'management-accountant-city-of-london',
  'Alderstone Business Services',
  '',
  'City of London, London',
  'London',
  'Greater London',
  '',
  'United Kingdom',
  50000.00,
  55000.00,
  '£50,000–£55,000 per annum, plus 8% bonus, pension and hybrid working',
  'per year',
  '£',
  'Full-time',
  'Hybrid',
  'Accounting & Finance',
  'Alderstone Business Services is seeking a qualified or part-qualified Management Accountant to join its finance team in the City of London. The role covers management accounts, reconciliations, cash-flow forecasting, variance analysis and financial reporting.',
  'Salary: £50,000 to £55,000 per annum, plus 8% bonus, pension and hybrid working.\n\nContract: Permanent (Full-time).\n\nLocation: City of London, London (Hybrid working after probation).\n\nWorking Language: English.\n\nJob Level: Experienced.\n\nAlderstone Business Services is looking for a qualified or part-qualified Management Accountant to strengthen its finance team in the City of London.\n\nThe successful candidate will take responsibility for monthly management accounts, balance-sheet reconciliations, cash-flow forecasting and variance commentary across a portfolio of operating units.\n\nYou will work closely with budget holders, improve financial reporting controls and provide support during the annual audit.\n\nThe role requires someone who can work accurately with financial information while also explaining financial results clearly to colleagues who do not work within finance.\n\nApplication:\nCandidates are registering their interest through Promarch Consulting.',
  '[\"Prepare monthly management accounts.\", \"Complete balance-sheet reconciliations.\", \"Prepare and maintain cash-flow forecasts.\", \"Produce variance analysis and commentary.\", \"Support financial reporting across a portfolio of operating units.\", \"Work closely with departmental budget holders.\", \"Improve financial reporting processes and controls.\", \"Support the annual audit process.\", \"Explain financial performance and results to non-finance colleagues.\"]',
  '[\"Qualified or part-qualified accountant.\", \"Strong Excel skills.\", \"Excellent attention to detail.\", \"Ability to communicate financial information clearly.\", \"Confidence working with non-finance colleagues.\", \"ACCA, CIMA or ACA study is welcomed.\", \"Working language: English.\"]',
  '[\"Qualified or part-qualified accountant (ACCA / CIMA / ACA study welcomed).\", \"Experienced level finance background.\"]',
  'Proven experience in monthly management accounts, balance-sheet reconciliations, cash-flow forecasting and variance commentary.',
  '[\"Management Accounts\", \"Balance-Sheet Reconciliations\", \"Cash-Flow Forecasting\", \"Variance Analysis\", \"Financial Reporting\", \"Audit Support\", \"Advanced Excel\", \"Financial Controls\"]',
  '[\"Salary of £50,000 to £55,000 per annum.\", \"8% bonus.\", \"Employer pension contributions.\", \"Hybrid working after probation.\", \"25 days\' annual holiday.\", \"Funded professional development.\"]',
  'Full-time, Permanent (Hybrid working after probation)',
  'City of London, Greater London',
  'Alderstone Business Services',
  '',
  '',
  '2026-09-02 09:00:00',
  '2026-10-01 23:59:59',
  0,
  'published',
  '2026-09-02 09:00:00',
  '2026-09-02 09:00:00',
  'Alderstone Business Services',
  'Alderstone Business Services',
  0,
  0
) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Salary Tier for Vacancy 4
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`) VALUES
('alderstone-job-001', 'Management Accountant', '£50,000–£55,000 / year', '£50,000–£55,000 / year', '£50,000–£55,000 / year', '£50,000–£55,000 per annum, plus 8% bonus, pension and hybrid working', 1);

-- ------------------------------------------------------------------------------
-- 8. Administrator Accounts
-- Note: Zero default or hard-coded administrator credentials are seeded.
-- To create your first administrator securely with a bespoke password,
-- run the one-time setup tool:
--   CLI: php setup_admin.php
--   Web: https://promarchconsulting.co.uk/api/setup_admin.php
-- ------------------------------------------------------------------------------

