/*
  Warnings:

  - You are about to drop the column `ativo` on the `Plano` table. All the data in the column will be lost.
  - You are about to drop the column `situacao` on the `Plano` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plano" DROP COLUMN "ativo",
DROP COLUMN "situacao";

-- AlterTable
ALTER TABLE "Produtor" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "situacao" TEXT NOT NULL DEFAULT 'pago';
