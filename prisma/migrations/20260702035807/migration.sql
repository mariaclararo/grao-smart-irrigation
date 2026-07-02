-- DropForeignKey
ALTER TABLE "Funcionario" DROP CONSTRAINT "Funcionario_id_fkey";

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
