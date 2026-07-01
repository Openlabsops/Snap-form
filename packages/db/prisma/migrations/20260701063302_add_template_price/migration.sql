-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "templates_isPublic_idx" ON "templates"("isPublic");
