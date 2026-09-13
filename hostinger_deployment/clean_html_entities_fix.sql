-- ==============================================================================
-- PROMARCH CONSULTING - RECURSIVE HTML ENTITY CLEANUP MIGRATION
-- Fixes multiply-encoded entities like &amp;amp;amp; in existing job records
-- Run this in phpMyAdmin if your database contains pre-existing encoded strings
-- ==============================================================================

-- 1. Clean Category (repeat multiple times to unwrap nested &amp;amp;amp;...)
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';
UPDATE `jobs` SET `category` = REPLACE(`category`, '&amp;', '&') WHERE `category` LIKE '%&amp;%';

-- 2. Clean Title
UPDATE `jobs` SET `title` = REPLACE(`title`, '&amp;', '&') WHERE `title` LIKE '%&amp;%';
UPDATE `jobs` SET `title` = REPLACE(`title`, '&amp;', '&') WHERE `title` LIKE '%&amp;%';
UPDATE `jobs` SET `title` = REPLACE(`title`, '&amp;', '&') WHERE `title` LIKE '%&amp;%';
UPDATE `jobs` SET `title` = REPLACE(`title`, '&amp;', '&') WHERE `title` LIKE '%&amp;%';

-- 3. Clean Company
UPDATE `jobs` SET `company` = REPLACE(`company`, '&amp;', '&') WHERE `company` LIKE '%&amp;%';
UPDATE `jobs` SET `company` = REPLACE(`company`, '&amp;', '&') WHERE `company` LIKE '%&amp;%';

-- 4. Clean Location
UPDATE `jobs` SET `location` = REPLACE(`location`, '&amp;', '&') WHERE `location` LIKE '%&amp;%';
UPDATE `jobs` SET `location` = REPLACE(`location`, '&amp;', '&') WHERE `location` LIKE '%&amp;%';

-- 5. Clean Job Card Caption
UPDATE `jobs` SET `job_card_caption` = REPLACE(`job_card_caption`, '&amp;', '&') WHERE `job_card_caption` LIKE '%&amp;%';
UPDATE `jobs` SET `job_card_caption` = REPLACE(`job_card_caption`, '&amp;', '&') WHERE `job_card_caption` LIKE '%&amp;%';

-- 6. Clean Quotes and apostrophes
UPDATE `jobs` SET `title` = REPLACE(REPLACE(REPLACE(`title`, '&quot;', '"'), '&#039;', '\''), '&#39;', '\'') WHERE `title` LIKE '%&%';
UPDATE `jobs` SET `category` = REPLACE(REPLACE(REPLACE(`category`, '&quot;', '"'), '&#039;', '\''), '&#39;', '\'') WHERE `category` LIKE '%&%';
UPDATE `jobs` SET `company` = REPLACE(REPLACE(REPLACE(`company`, '&quot;', '"'), '&#039;', '\''), '&#39;', '\'') WHERE `company` LIKE '%&%';
UPDATE `jobs` SET `job_card_caption` = REPLACE(REPLACE(REPLACE(`job_card_caption`, '&quot;', '"'), '&#039;', '\''), '&#39;', '\'') WHERE `job_card_caption` LIKE '%&%';

-- Standardize exact category names if needed
UPDATE `jobs` SET `category` = 'Office & Administration' WHERE `category` LIKE '%Office%Admin%';
UPDATE `jobs` SET `category` = 'Healthcare & Social Care' WHERE `category` LIKE '%Healthcare%Social%';
UPDATE `jobs` SET `category` = 'Healthcare & Nursing' WHERE `category` LIKE '%Healthcare%Nursing%';
UPDATE `jobs` SET `category` = 'Accounting & Finance' WHERE `category` LIKE '%Accounting%Finance%';
UPDATE `jobs` SET `category` = 'Warehouse & Logistics' WHERE `category` LIKE '%Warehouse%Logistics%';
UPDATE `jobs` SET `category` = 'Hospitality & Dining' WHERE `category` LIKE '%Hospitality%Dining%';
UPDATE `jobs` SET `category` = 'Facilities & Maintenance' WHERE `category` LIKE '%Facilities%Maintenance%';
UPDATE `jobs` SET `category` = 'Management & Supervision' WHERE `category` LIKE '%Management%Supervision%';
