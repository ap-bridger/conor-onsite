/*
  Warnings:

  - You are about to drop the column `comment` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receivedCents` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `spentCents` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `amountCents` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memo` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "memo" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("category", "date", "description", "id", "status", "vendor") SELECT "category", "date", "description", "id", "status", "vendor" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
