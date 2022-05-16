-- CreateEnum
CREATE TYPE "Measurement" AS ENUM ('ml', 'g', 'unit');

-- CreateEnum
CREATE TYPE "CostsCategories" AS ENUM ('staff', 'variable', 'operationals');

-- CreateTable
CREATE TABLE "budgets" (
    "id" SERIAL NOT NULL,
    "guests" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "categoryId" INTEGER,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets_cocktails" (
    "id" SERIAL NOT NULL,
    "budgetId" INTEGER NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "budgets_cocktails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktailDisposables" (
    "id" SERIAL NOT NULL,
    "disposableId" INTEGER NOT NULL,
    "cocktailId" INTEGER NOT NULL,

    CONSTRAINT "cocktailDisposables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktailDrinks" (
    "id" SERIAL NOT NULL,
    "drinkId" INTEGER NOT NULL,
    "cocktailId" INTEGER NOT NULL,

    CONSTRAINT "cocktailDrinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktailInputs" (
    "id" SERIAL NOT NULL,
    "inputId" INTEGER NOT NULL,
    "cocktailId" INTEGER NOT NULL,

    CONSTRAINT "cocktailInputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktails" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "cocktails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "CostsCategories" NOT NULL,

    CONSTRAINT "costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(11),
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposables" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "disposables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drinks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "volume" INTEGER NOT NULL,
    "alcoholic" BOOLEAN NOT NULL,

    CONSTRAINT "drinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inputs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "measurement" "Measurement" NOT NULL,

    CONSTRAINT "inputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cocktails_name_key" ON "cocktails"("name");

-- CreateIndex
CREATE UNIQUE INDEX "costs_name_key" ON "costs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "disposables_name_key" ON "disposables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "drinks_name_key" ON "drinks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inputs_name_key" ON "inputs"("name");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets_cocktails" ADD CONSTRAINT "budgets_cocktails_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets_cocktails" ADD CONSTRAINT "budgets_cocktails_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDisposables" ADD CONSTRAINT "cocktailDisposables_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDisposables" ADD CONSTRAINT "cocktailDisposables_disposableId_fkey" FOREIGN KEY ("disposableId") REFERENCES "disposables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDrinks" ADD CONSTRAINT "cocktailDrinks_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDrinks" ADD CONSTRAINT "cocktailDrinks_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "drinks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailInputs" ADD CONSTRAINT "cocktailInputs_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailInputs" ADD CONSTRAINT "cocktailInputs_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "inputs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
