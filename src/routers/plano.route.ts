import type { FastifyInstance } from 'fastify';
import { planoController } from '../controllers/PlanoController.js';
//função seta com todas rotas para plano
async function planoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', planoController.get);
  fastify.get('/:id', planoController.getParamId);
  fastify.post('/', planoController.post);
  fastify.put('/:id', planoController.putParamId);
  fastify.delete('/:id', planoController.deleteParamId);
}
export default planoRoutes;