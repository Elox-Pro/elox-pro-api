-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NULL,

    UNIQUE INDEX `companies_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('SYSTEM_ADMIN', 'COMPANY_OWNER', 'COMPANY_ADMIN', 'COMPANY_CUSTOMER') NOT NULL DEFAULT 'COMPANY_CUSTOMER',
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `avatar_url` VARCHAR(191) NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `phone_verified` BOOLEAN NOT NULL DEFAULT false,
    `tfa_type` ENUM('NONE', 'EMAIL', 'SMS', 'GOOGLE_TFA') NOT NULL DEFAULT 'NONE',
    `last_login_at` DATETIME(3) NULL,
    `company_id` INTEGER NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('ID_CARD', 'PASSPORT', 'ADDRESS', 'SELFIE') NOT NULL,
    `value` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `document_front_url` VARCHAR(191) NULL,
    `document_back_url` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `street_address` VARCHAR(191) NOT NULL,
    `apartament_number` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `type` ENUM('HOME', 'WORK', 'BILLING') NOT NULL DEFAULT 'HOME',
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER NOT NULL,
    `country_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `iso2` VARCHAR(191) NOT NULL,
    `e164` INTEGER NOT NULL,
    `ccy` VARCHAR(191) NULL,
    `lang` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bank_name` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `account_type` ENUM('SAVINGS', 'CHECKING', 'LOAN') NOT NULL DEFAULT 'SAVINGS',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `iban` VARCHAR(191) NULL,
    `bic` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_bank_accounts_account_number_key`(`account_number`),
    UNIQUE INDEX `user_bank_accounts_iban_key`(`iban`),
    UNIQUE INDEX `user_bank_accounts_bic_key`(`bic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KYCs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `rejected` BOOLEAN NOT NULL DEFAULT false,
    `rejection_reason` VARCHAR(191) NULL,
    `verification_date` DATETIME(3) NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `KYCs_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('PERSONAL', 'FAMILIAR_REFERENCE', 'SPONSOR') NOT NULL,
    `relationship` ENUM('PAREN', 'CHILD', 'BROTHER', 'FRIEND', 'COWORKER') NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_contacts_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ranks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `minimum_points` INTEGER NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(191) NULL,

    UNIQUE INDEX `ranks_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_ranks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `points` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `rank_id` INTEGER NOT NULL,

    UNIQUE INDEX `user_ranks_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rank_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('LOAN_APPLICATION', 'REPAYMENT', 'REFERRAL_BONUS') NOT NULL,
    `points_earned` INTEGER NOT NULL,
    `description` TEXT NULL,
    `details` JSON NULL,
    `user_rank_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `application_date` DATETIME(3) NOT NULL,
    `approved_date` DATETIME(3) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `interest_rate` DECIMAL(5, 2) NOT NULL,
    `monthly_interest_rate` DECIMAL(5, 2) NOT NULL,
    `term` INTEGER NOT NULL,
    `repayment_frequency` ENUM('DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY') NOT NULL DEFAULT 'MONTHLY',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CLOSED', 'PAST_DUE') NOT NULL DEFAULT 'PENDING',
    `enabled_late_fee` BOOLEAN NOT NULL DEFAULT false,
    `closed_date` DATETIME(3) NULL,
    `past_due_stage` ENUM('EARLY', 'LATE', 'SEVERE') NULL,
    `collection_status` ENUM('INITIATED', 'ONGOING', 'SETTLED') NOT NULL,
    `default_date` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `customer_id` INTEGER NOT NULL,
    `settings_id` INTEGER NOT NULL,
    `guarantor_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `loan_type` ENUM('PERSONAL', 'AUTO', 'MORTGAGE') NOT NULL DEFAULT 'PERSONAL',
    `late_fee_percentage` DECIMAL(5, 2) NOT NULL,
    `grace_period_days` INTEGER NOT NULL,
    `default_date_period` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_repayments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment_date` DATETIME(3) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `principal_amount` DECIMAL(10, 2) NOT NULL,
    `interest_amount` DECIMAL(10, 2) NOT NULL,
    `late_fee_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` ENUM('BANK_TRANSFER', 'CREDIT_CARD', 'CASH') NOT NULL,
    `transaction_reference` VARCHAR(191) NOT NULL,
    `transaction_url` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `loan_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `installment_number` INTEGER NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `principal_amount` DECIMAL(10, 2) NOT NULL,
    `interest_amount` DECIMAL(10, 2) NOT NULL,
    `late_fee_amount` DECIMAL(10, 2) NOT NULL,
    `total_payment` DECIMAL(10, 2) NOT NULL,
    `payment_status` ENUM('PENDING', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `paid_date` DATETIME(3) NOT NULL,
    `loan_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_collaterals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('PROPERTY', 'VEHICLE', 'STOCK') NOT NULL,
    `description` TEXT NULL,
    `estimated_value` DECIMAL(10, 2) NOT NULL,
    `loan_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loan_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('LOAN_AGREEMENT', 'PROMISORY_NOTE', 'COLLATERAL_DOCUMENT') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `documentUrl` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `loan_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_trails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `action` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
    `resource` VARCHAR(191) NOT NULL,
    `resource_id` INTEGER NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `user_agent` VARCHAR(191) NOT NULL,
    `details` JSON NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_documents` ADD CONSTRAINT `users_documents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_bank_accounts` ADD CONSTRAINT `user_bank_accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KYCs` ADD CONSTRAINT `KYCs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_contacts` ADD CONSTRAINT `user_contacts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ranks` ADD CONSTRAINT `user_ranks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_ranks` ADD CONSTRAINT `user_ranks_rank_id_fkey` FOREIGN KEY (`rank_id`) REFERENCES `ranks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rank_transactions` ADD CONSTRAINT `rank_transactions_user_rank_id_fkey` FOREIGN KEY (`user_rank_id`) REFERENCES `user_ranks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_settings_id_fkey` FOREIGN KEY (`settings_id`) REFERENCES `loan_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_guarantor_id_fkey` FOREIGN KEY (`guarantor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loan_settings` ADD CONSTRAINT `loan_settings_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loan_repayments` ADD CONSTRAINT `loan_repayments_loan_id_fkey` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loan_schedules` ADD CONSTRAINT `loan_schedules_loan_id_fkey` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loan_collaterals` ADD CONSTRAINT `loan_collaterals_loan_id_fkey` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loan_documents` ADD CONSTRAINT `loan_documents_loan_id_fkey` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_trails` ADD CONSTRAINT `audit_trails_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
