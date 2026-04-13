-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('PRODUTOR', 'FUNCIONARIO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtor" (
    "id" INTEGER NOT NULL,
    "cnpj" TEXT NOT NULL,
    "planoId" INTEGER NOT NULL,

    CONSTRAINT "Produtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL,
    "especialidade" TEXT NOT NULL,
    "empregadorId" INTEGER NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "limiteHectares" DOUBLE PRECISION NOT NULL,
    "precoMensal" DOUBLE PRECISION NOT NULL,
    "situacao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plantacao" (
    "id" SERIAL NOT NULL,
    "nomeFazenda" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "totalHectares" DOUBLE PRECISION NOT NULL,
    "proprietarioId" INTEGER NOT NULL,

    CONSTRAINT "Plantacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "areaHectares" DOUBLE PRECISION NOT NULL,
    "espacamentoTubos" DOUBLE PRECISION NOT NULL,
    "plantacaoId" INTEGER NOT NULL,
    "culturaId" INTEGER NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumoSaude" (
    "id" SERIAL NOT NULL,
    "umidadeMedia" DOUBLE PRECISION NOT NULL,
    "plantacaoExibidaId" INTEGER NOT NULL,

    CONSTRAINT "ResumoSaude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cultura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "variedade" TEXT NOT NULL,
    "indiceKc" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Cultura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispositivo" (
    "id" SERIAL NOT NULL,
    "macAddress" TEXT NOT NULL,
    "nivelBateria" INTEGER NOT NULL,
    "setorDeOperacaoId" INTEGER NOT NULL,

    CONSTRAINT "Dispositivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "dispAssociadoId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leitura" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorRaizId" INTEGER NOT NULL,

    CONSTRAINT "Leitura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DispositivoAlerta" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DispositivoAlerta_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Produtor_cnpj_key" ON "Produtor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Produtor_planoId_key" ON "Produtor"("planoId");

-- CreateIndex
CREATE UNIQUE INDEX "Setor_culturaId_key" ON "Setor"("culturaId");

-- CreateIndex
CREATE UNIQUE INDEX "Dispositivo_macAddress_key" ON "Dispositivo"("macAddress");

-- CreateIndex
CREATE INDEX "_DispositivoAlerta_B_index" ON "_DispositivoAlerta"("B");

-- AddForeignKey
ALTER TABLE "Produtor" ADD CONSTRAINT "Produtor_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produtor" ADD CONSTRAINT "Produtor_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_id_fkey" FOREIGN KEY ("id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_empregadorId_fkey" FOREIGN KEY ("empregadorId") REFERENCES "Produtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plantacao" ADD CONSTRAINT "Plantacao_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Produtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_plantacaoId_fkey" FOREIGN KEY ("plantacaoId") REFERENCES "Plantacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor" ADD CONSTRAINT "Setor_culturaId_fkey" FOREIGN KEY ("culturaId") REFERENCES "Cultura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumoSaude" ADD CONSTRAINT "ResumoSaude_plantacaoExibidaId_fkey" FOREIGN KEY ("plantacaoExibidaId") REFERENCES "Plantacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispositivo" ADD CONSTRAINT "Dispositivo_setorDeOperacaoId_fkey" FOREIGN KEY ("setorDeOperacaoId") REFERENCES "Setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_dispAssociadoId_fkey" FOREIGN KEY ("dispAssociadoId") REFERENCES "Dispositivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leitura" ADD CONSTRAINT "Leitura_sensorRaizId_fkey" FOREIGN KEY ("sensorRaizId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DispositivoAlerta" ADD CONSTRAINT "_DispositivoAlerta_A_fkey" FOREIGN KEY ("A") REFERENCES "Dispositivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DispositivoAlerta" ADD CONSTRAINT "_DispositivoAlerta_B_fkey" FOREIGN KEY ("B") REFERENCES "ResumoSaude"("id") ON DELETE CASCADE ON UPDATE CASCADE;
