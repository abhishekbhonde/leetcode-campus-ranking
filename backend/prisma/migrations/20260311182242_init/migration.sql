-- AlterTable
ALTER TABLE "College" ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "state" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '';
