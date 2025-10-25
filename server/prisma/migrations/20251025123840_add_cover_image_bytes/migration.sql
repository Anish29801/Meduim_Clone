/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Article` DROP COLUMN `coverImage`,
    ADD COLUMN `coverImageBytes` LONGBLOB NULL;
