/*
  Warnings:

  - You are about to drop the column `cellId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_churchId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_cellId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "cellId",
ADD COLUMN     "smallGroupId" TEXT;

-- DropTable
DROP TABLE "Cell";

-- CreateTable
CREATE TABLE "SmallGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderId" TEXT,
    "address" TEXT,
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "status" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmallGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_smallGroupId_fkey" FOREIGN KEY ("smallGroupId") REFERENCES "SmallGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmallGroup" ADD CONSTRAINT "SmallGroup_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
