/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - The `enableTimes` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "userName" TEXT NOT NULL,
DROP COLUMN "enableTimes",
ADD COLUMN     "enableTimes" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
