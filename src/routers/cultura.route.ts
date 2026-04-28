import type { FastifyInstance } from 'fastify';
import { culturaController } from '../controllers/CulturaController.js';
//função seta com todas rotas para cultura
async function culturaRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', culturaController.get);
  fastify.get('/:id', culturaController.getParamId);
  fastify.post('/', culturaController.post);
  fastify.put('/:id', culturaController.putParamId);
  fastify.delete('/:id', culturaController.deleteParamId);
}
export default culturaRoutes;