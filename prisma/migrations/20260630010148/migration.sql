-- DropForeignKey
ALTER TABLE "Dispositivo" DROP CONSTRAINT "Dispositivo_setorDeOperacaoId_fkey";

-- AddForeignKey
ALTER TABLE "Dispositivo" ADD CONSTRAINT "Dispositivo_setorDeOperacaoId_fkey" FOREIGN KEY ("setorDeOperacaoId") REFERENCES "Setor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
