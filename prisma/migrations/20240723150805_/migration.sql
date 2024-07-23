-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "representative" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "identification" TEXT,
    "name" TEXT,
    "stateRegistration" TEXT,
    "razaoSocial" TEXT,
    "classification" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "tell" TEXT,
    "email" TEXT,
    "userId" TEXT,
    CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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

-- CreateTable
CREATE TABLE "ProductQuantity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" REAL NOT NULL,
    "productSaleId" TEXT,
    CONSTRAINT "ProductQuantity_productSaleId_fkey" FOREIGN KEY ("productSaleId") REFERENCES "ProductSale" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductSale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codePedidoEcommerce" TEXT NOT NULL,
    "codePedido" TEXT NOT NULL,
    "numeroPedido" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "obs" TEXT NOT NULL,
    "transport" TEXT NOT NULL,
    "planSale" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ProductSale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductSale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductQuantity_id_key" ON "ProductQuantity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSale_id_key" ON "ProductSale"("id");
