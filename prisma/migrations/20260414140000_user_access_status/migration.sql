-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "accessStatus" "AccessStatus" NOT NULL DEFAULT 'PENDING';

-- Grandfather existing users (created before this migration) to full access.
UPDATE "User" SET "accessStatus" = 'ACTIVE';
