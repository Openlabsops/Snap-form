-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('GOOGLE_SHEETS');

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "formId" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "form_integrations" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL DEFAULT 'GOOGLE_SHEETS',
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "spreadsheetId" TEXT NOT NULL,
    "spreadsheetUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_integrations_formId_idx" ON "form_integrations"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "form_integrations_formId_provider_key" ON "form_integrations"("formId", "provider");

-- CreateIndex
CREATE INDEX "templates_formId_idx" ON "templates"("formId");

-- AddForeignKey
ALTER TABLE "form_integrations" ADD CONSTRAINT "form_integrations_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
