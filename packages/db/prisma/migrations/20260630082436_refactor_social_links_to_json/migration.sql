/*
  Warnings:

  - You are about to drop the column `instagramUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `xUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "instagramUrl",
DROP COLUMN "linkedinUrl",
DROP COLUMN "xUrl",
ADD COLUMN     "socialLinks" JSONB NOT NULL DEFAULT '{}';
