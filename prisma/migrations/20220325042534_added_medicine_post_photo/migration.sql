/*
  Warnings:

  - Added the required column `photo` to the `MedicinePost` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicinePost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "showPhoneNumber" BOOLEAN NOT NULL DEFAULT false,
    "photo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "MedicinePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicinePost" ("address", "content", "createdAt", "id", "showPhoneNumber", "type", "updatedAt", "userId") SELECT "address", "content", "createdAt", "id", "showPhoneNumber", "type", "updatedAt", "userId" FROM "MedicinePost";
DROP TABLE "MedicinePost";
ALTER TABLE "new_MedicinePost" RENAME TO "MedicinePost";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
