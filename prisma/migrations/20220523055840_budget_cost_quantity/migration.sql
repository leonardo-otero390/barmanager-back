/*
  Warnings:

  - Added the required column `quantity` to the `budget_costs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget_costs" ADD COLUMN     "quantity" INTEGER NOT NULL;
