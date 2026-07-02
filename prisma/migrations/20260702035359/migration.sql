-- DropForeignKey
ALTER TABLE "Notificacao" DROP CONSTRAINT "Notificacao_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Plantacao" DROP CONSTRAINT "Plantacao_proprietarioId_fkey";

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plantacao" ADD CONSTRAINT "Plantacao_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Produtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
