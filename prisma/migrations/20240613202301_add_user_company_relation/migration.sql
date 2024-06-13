/*
  Warnings:

  - You are about to drop the column `company_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_company_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `company_id`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lang`,
    DROP COLUMN `lastName`,
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    MODIFY `gender` ENUM('MALE', 'FEMALE') NULL;

-- CreateTable
CREATE TABLE `avatars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `avatars_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_user_companies` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_companies_AB_unique`(`A`, `B`),
    INDEX `_user_companies_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `countries_name_key` ON `countries`(`name`);

-- AddForeignKey
ALTER TABLE `_user_companies` ADD CONSTRAINT `_user_companies_A_fkey` FOREIGN KEY (`A`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_companies` ADD CONSTRAINT `_user_companies_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
