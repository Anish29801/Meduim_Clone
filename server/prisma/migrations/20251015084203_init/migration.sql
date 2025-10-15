/*
  Warnings:

  - You are about to drop the column `tags` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `tags`,
    MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `isAdmin`,
    ADD COLUMN `role` ENUM('USER', 'ADMIN', 'SUBADMIN') NOT NULL DEFAULT 'USER',
    MODIFY `username` VARCHAR(255) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `fullName` MEDIUMTEXT NULL;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ArticleTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ArticleTags_AB_unique`(`A`, `B`),
    INDEX `_ArticleTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleTags` ADD CONSTRAINT `_ArticleTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleTags` ADD CONSTRAINT `_ArticleTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
