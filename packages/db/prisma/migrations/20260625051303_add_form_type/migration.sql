/*
  Warnings:

  - You are about to drop the column `provider` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `accounts` table. All the data in the column will be lost.
  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[providerId,accountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('SCROLL', 'STEP', 'CHAT');

-- DropIndex
DROP INDEX IF EXISTS "accounts_provider_providerAccountId_key";

-- AlterTable (Accounts: Rename instead of drop)
ALTER TABLE "accounts" RENAME COLUMN "provider" TO "providerId";
ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "accountId";
ALTER TABLE "accounts" ADD COLUMN "password" TEXT;
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "type";

-- AlterTable (Forms: Add Type)
ALTER TABLE "forms" ADD COLUMN "type" "FormType" NOT NULL DEFAULT 'SCROLL';

-- AlterTable (Users: Safely convert emailVerified to boolean)
ALTER TABLE "users" ALTER COLUMN "emailVerified" TYPE BOOLEAN USING (
  CASE 
    WHEN "emailVerified" IS NOT NULL THEN true 
    ELSE false 
  END
);
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DEFAULT false;
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_providerId_accountId_key" ON "accounts"("providerId", "accountId");
