import type { FastifyInstance } from 'fastify';
import { sensorController } from '../controllers/SensorController.js';
//função seta com todas rotas para sensor
async function sensorRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', sensorController.get);
  fastify.get('/:id', sensorController.getParamId);
  fastify.post('/', sensorController.post);
  fastify.put('/:id', sensorController.putParamId);
  fastify.delete('/:id', sensorController.deleteParamId);
}
export default sensorRoutes;