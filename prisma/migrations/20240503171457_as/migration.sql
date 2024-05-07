/*
  Warnings:

  - Added the required column `razaoSocial` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN DEFAULT false;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateRegistration" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "tell" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("classification", "code", "id", "identification", "name", "stateRegistration", "tell", "userId") SELECT "classification", "code", "id", "identification", "name", "stateRegistration", "tell", "userId" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
