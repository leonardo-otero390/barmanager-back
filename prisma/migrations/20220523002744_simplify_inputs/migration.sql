/*
  Warnings:

  - You are about to drop the `cocktailDisposables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cocktailDrinks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `drinks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `inputs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cocktailDisposables" DROP CONSTRAINT "cocktailDisposables_cocktailId_fkey";

-- DropForeignKey
ALTER TABLE "cocktailDisposables" DROP CONSTRAINT "cocktailDisposables_disposableId_fkey";

-- DropForeignKey
ALTER TABLE "cocktailDisposables" DROP CONSTRAINT "cocktailDisposables_measurementId_fkey";

-- DropForeignKey
ALTER TABLE "cocktailDrinks" DROP CONSTRAINT "cocktailDrinks_cocktailId_fkey";

-- DropForeignKey
ALTER TABLE "cocktailDrinks" DROP CONSTRAINT "cocktailDrinks_drinkId_fkey";

-- DropForeignKey
ALTER TABLE "cocktailDrinks" DROP CONSTRAINT "cocktailDrinks_measurementId_fkey";

-- AlterTable
ALTER TABLE "inputs" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "cocktailDisposables";

-- DropTable
DROP TABLE "cocktailDrinks";

-- DropTable
DROP TABLE "drinks";

-- CreateTable
CREATE TABLE "budgets_disposables" (
    "id" SERIAL NOT NULL,
    "budgetId" INTEGER NOT NULL,
    "disposableId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "measurementId" INTEGER NOT NULL,

    CONSTRAINT "budgets_disposables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InputCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InputCategory_name_key" ON "InputCategory"("name");

-- AddForeignKey
ALTER TABLE "budgets_disposables" ADD CONSTRAINT "budgets_disposables_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets_disposables" ADD CONSTRAINT "budgets_disposables_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets_disposables" ADD CONSTRAINT "budgets_disposables_disposableId_fkey" FOREIGN KEY ("disposableId") REFERENCES "disposables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InputCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
