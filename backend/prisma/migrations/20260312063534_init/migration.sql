/*
  Warnings:

  - A unique constraint covering the columns `[leetcode_slug]` on the table `College` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "College" ADD COLUMN     "leetcode_slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "College_leetcode_slug_key" ON "College"("leetcode_slug");
