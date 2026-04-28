import type { FastifyInstance } from 'fastify';
import { setorController } from '../controllers/SetorController.js';
//função seta com todas rotas para setor
async function setorRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', setorController.get);
  fastify.get('/:id', setorController.getParamId);
  fastify.post('/', setorController.post);
  fastify.put('/:id', setorController.putParamId);
  fastify.delete('/:id', setorController.deleteParamId);
}
export default setorRoutes;