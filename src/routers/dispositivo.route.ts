import type { FastifyInstance } from 'fastify';
import { dispositivoController } from '../controllers/DispositivoController.js';
//função seta com todas rotas para dispositivo
async function dispositivoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', dispositivoController.get);
  fastify.get('/:id', dispositivoController.getParamId);
  fastify.post('/', dispositivoController.post);
  fastify.put('/:id', dispositivoController.putParamId);
  fastify.delete('/:id', dispositivoController.deleteParamId);
}
export default dispositivoRoutes;