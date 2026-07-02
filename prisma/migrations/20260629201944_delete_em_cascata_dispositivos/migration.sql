-- DropForeignKey
ALTER TABLE "Leitura" DROP CONSTRAINT "Leitura_sensorRaizId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_dispAssociadoId_fkey";

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_dispAssociadoId_fkey" FOREIGN KEY ("dispAssociadoId") REFERENCES "Dispositivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leitura" ADD CONSTRAINT "Leitura_sensorRaizId_fkey" FOREIGN KEY ("sensorRaizId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
