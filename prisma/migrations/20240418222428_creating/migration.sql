-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "apres" TEXT NOT NULL,
    "ipi" TEXT NOT NULL,
    "table1" REAL NOT NULL,
    "table2" REAL NOT NULL,
    "table3" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");
