/*
  Warnings:

  - You are about to drop the column `admin` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "admin",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT E'basic';
