-- ==============================================================================
-- Migration: Add job_card_caption column and migrate Muve Healthcare captions
-- Target Database: Hostinger MySQL / Promarch Consulting Production Database
-- Date: 2026-09-12
-- ==============================================================================

SET NAMES utf8mb4;

-- 1. Safely add column if not exists
SET @dbname = DATABASE();
SET @tablename = "jobs";
SET @columnname = "job_card_caption";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  "ALTER TABLE `jobs` ADD COLUMN `job_card_caption` VARCHAR(255) NULL COMMENT 'Optional highlight badge displayed on public job card' AFTER `working_hours`"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Migrate existing Muve Healthcare vacancies to set job_card_caption
UPDATE `jobs`
SET `job_card_caption` = '36-hour and 48-hour contracts available'
WHERE `id` IN ('muve-job-001', 'muve-job-002')
  AND (`job_card_caption` IS NULL OR `job_card_caption` = '');
