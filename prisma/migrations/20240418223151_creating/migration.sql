/*
  Warnings:

  - You are about to drop the `ProductClient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToProductClient` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductClient";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProductToProductClient";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductWith" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" INTEGER,
    "salesId" TEXT,
    CONSTRAINT "ProductWith_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductWith_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "Sales" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sales_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductWith_id_key" ON "ProductWith"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Sales_id_key" ON "Sales"("id");
