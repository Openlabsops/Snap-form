-- AlterTable
ALTER TABLE "users" ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "xUrl" TEXT;
