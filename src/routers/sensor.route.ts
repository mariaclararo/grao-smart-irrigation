import type { FastifyInstance } from 'fastify';
import { sensorController } from '../controllers/SensorController.js';
import { deleteSensorParamIdSchema, getSensorParamIdSchema, getSensorSchema, postSensorSchema, putSensorParamIdSchema } from '../schemas/sensor.schema.js';

//função seta com todas rotas para sensor
async function sensorRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getSensorSchema, sensorController.get);
  fastify.get('/:id', getSensorParamIdSchema, sensorController.getParamId);
  fastify.post('/', postSensorSchema, sensorController.post);
  fastify.put('/:id', putSensorParamIdSchema, sensorController.putParamId);
  fastify.delete('/:id', deleteSensorParamIdSchema, sensorController.deleteParamId);
}
export default sensorRoutes; 
