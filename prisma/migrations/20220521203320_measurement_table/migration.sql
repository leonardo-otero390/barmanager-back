/*
  Warnings:

  - You are about to drop the column `volume` on the `drinks` table. All the data in the column will be lost.
  - You are about to drop the column `measurement` on the `inputs` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `budgets` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `measurementId` to the `cocktailDisposables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `cocktailDisposables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementId` to the `cocktailDrinks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `cocktailDrinks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementId` to the `cocktailInputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `cocktailInputs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementId` to the `disposables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementId` to the `inputs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MeasurementCategory" AS ENUM ('mass', 'volume', 'unit');

-- AlterTable
ALTER TABLE "budgets" ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "cocktailDisposables" ADD COLUMN     "measurementId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cocktailDrinks" ADD COLUMN     "measurementId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cocktailInputs" ADD COLUMN     "measurementId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "disposables" ADD COLUMN     "measurementId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "drinks" DROP COLUMN "volume";

-- AlterTable
ALTER TABLE "inputs" DROP COLUMN "measurement",
ADD COLUMN     "measurementId" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- DropEnum
DROP TYPE "Measurement";

-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "MeasurementCategory" NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_costs" (
    "id" SERIAL NOT NULL,
    "budgetId" INTEGER NOT NULL,
    "costId" INTEGER NOT NULL,

    CONSTRAINT "budget_costs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_name_key" ON "Measurement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventCategory_name_key" ON "EventCategory"("name");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_costs" ADD CONSTRAINT "budget_costs_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_costs" ADD CONSTRAINT "budget_costs_costId_fkey" FOREIGN KEY ("costId") REFERENCES "costs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDisposables" ADD CONSTRAINT "cocktailDisposables_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailDrinks" ADD CONSTRAINT "cocktailDrinks_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktailInputs" ADD CONSTRAINT "cocktailInputs_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposables" ADD CONSTRAINT "disposables_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
