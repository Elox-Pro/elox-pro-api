-- AlterTable
ALTER TABLE `users` ADD COLUMN `lang` ENUM('DEFAULT', 'EN', 'ES') NOT NULL DEFAULT 'DEFAULT';