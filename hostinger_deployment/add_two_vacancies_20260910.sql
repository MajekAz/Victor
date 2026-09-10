-- ==============================================================================
-- Migration: Add Two New Vacancies to Promarch Consulting Production Database
-- Target Database: Hostinger MySQL
-- Date: 2026-09-10
-- Vacancies:
--   1. Digital Transformation Manager (Veolia)
--   2. Management Accountant (Alderstone Business Services)
-- Preserves existing Muve Healthcare vacancies and multi-tier salary tables.
-- Idempotent: Uses ON DUPLICATE KEY UPDATE so it can be executed safely.
-- ==============================================================================

SET NAMES utf8mb4;

-- 1. Vacancy 1: Digital Transformation Manager (Veolia)
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

-- Salary Tier for Vacancy 1
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`)
SELECT 'veolia-job-001', 'Digital Transformation Manager', '£35,000 / year', '£35,000 / year', '£35,000 / year', '£35,000 per annum plus enhanced pension and Veolia benefits', 1
WHERE NOT EXISTS (SELECT 1 FROM `job_salary_tiers` WHERE `job_id` = 'veolia-job-001' AND `role_label` = 'Digital Transformation Manager');

-- 2. Vacancy 2: Management Accountant (Alderstone Business Services)
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

-- Salary Tier for Vacancy 2
INSERT INTO `job_salary_tiers` (`job_id`, `role_label`, `hourly_rate`, `annual_36_hours`, `annual_48_hours`, `salary_notes`, `display_order`)
SELECT 'alderstone-job-001', 'Management Accountant', '£50,000–£55,000 / year', '£50,000–£55,000 / year', '£50,000–£55,000 / year', '£50,000–£55,000 per annum, plus 8% bonus, pension and hybrid working', 1
WHERE NOT EXISTS (SELECT 1 FROM `job_salary_tiers` WHERE `job_id` = 'alderstone-job-001' AND `role_label` = 'Management Accountant');

-- 3. Audit Activity Log (Safe: Uses INSERT IGNORE so missing tables/constraints cannot fail the migration)
INSERT IGNORE INTO `admin_activity_logs` (`action`, `job_id`, `job_title`, `details`, `admin_user`, `ip_address`, `created_at`) VALUES
('created', 'veolia-job-001', 'Digital Transformation Manager', 'Added published vacancy for Veolia in Haringey, London', 'System Migration', '127.0.0.1', NOW()),
('created', 'alderstone-job-001', 'Management Accountant', 'Added published vacancy for Alderstone Business Services in City of London', 'System Migration', '127.0.0.1', NOW());
