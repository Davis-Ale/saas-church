/*
  Warnings:

  - You are about to drop the `Church` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Church";

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
