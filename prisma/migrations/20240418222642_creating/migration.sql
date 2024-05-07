-- CreateTable
CREATE TABLE "ProductClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ProductClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductToProductClient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductToProductClient_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToProductClient_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductClient_id_key" ON "ProductClient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductClient_AB_unique" ON "_ProductToProductClient"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductClient_B_index" ON "_ProductToProductClient"("B");
