/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserPosition" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "userPosition" "UserPosition" NOT NULL DEFAULT 'FREE';

-- DropEnum
DROP TYPE "public"."UserRole";
