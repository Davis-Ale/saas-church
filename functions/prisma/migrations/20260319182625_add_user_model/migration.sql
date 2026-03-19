/*
  Warnings:

  - You are about to drop the column `aiSummary` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `aiSummaryUpdatedAt` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `ownerUid` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Church` table. All the data in the column will be lost.
  - You are about to drop the `CellMeeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeetingAttendance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CellMeeting" DROP CONSTRAINT "CellMeeting_cellId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingAttendance" DROP CONSTRAINT "MeetingAttendance_meetingId_fkey";

-- DropIndex
DROP INDEX "Cell_churchId_idx";

-- DropIndex
DROP INDEX "Church_ownerUid_idx";

-- DropIndex
DROP INDEX "Member_churchId_idx";

-- DropIndex
DROP INDEX "Member_email_idx";

-- AlterTable
ALTER TABLE "Cell" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Church" DROP COLUMN "aiSummary",
DROP COLUMN "aiSummaryUpdatedAt",
DROP COLUMN "currency",
DROP COLUMN "locale",
DROP COLUMN "ownerUid",
DROP COLUMN "timezone",
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "birthDate" SET DATA TYPE TEXT,
ALTER COLUMN "serviceApproved" SET DEFAULT true;

-- DropTable
DROP TABLE "CellMeeting";

-- DropTable
DROP TABLE "MeetingAttendance";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Path" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "status" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "price" DOUBLE PRECISION,
    "maxAttendees" INTEGER,
    "status" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT,
    "date" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Path" ADD CONSTRAINT "Path_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministry" ADD CONSTRAINT "Ministry_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
