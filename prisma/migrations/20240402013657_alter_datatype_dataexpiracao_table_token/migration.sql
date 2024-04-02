/*
  Warnings:

  - Changed the type of `dataExpiracao` on the `tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "dataExpiracao",
ADD COLUMN     "dataExpiracao" INTEGER NOT NULL;
