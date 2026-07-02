-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_empregadorId_fkey";

-- DropForeignKey
ALTER TABLE "ResumoSaude" DROP CONSTRAINT "ResumoSaude_plantacaoExibidaId_fkey";

-- DropForeignKey
ALTER TABLE "Setor" DROP CONSTRAINT "Setor_culturaId_fkey";

-- DropForeignKey
ALTER TABLE "Setor" DROP CONSTRAINT "Setor_plantacaoId_fkey";

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_empregadorId_fkey" FOREIGN KEY ("empregadorId") REFERENCES "Produtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_plantacaoId_fkey" FOREIGN KEY ("plantacaoId") REFERENCES "Plantacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_culturaId_fkey" FOREIGN KEY ("culturaId") REFERENCES "Cultura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumoSaude" ADD CONSTRAINT "ResumoSaude_plantacaoExibidaId_fkey" FOREIGN KEY ("plantacaoExibidaId") REFERENCES "Plantacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
