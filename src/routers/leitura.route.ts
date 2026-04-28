import type { FastifyInstance } from 'fastify';
import { leituraController } from '../controllers/LeituraController.js';
//função seta com todas rotas para leitura
async function leituraRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', leituraController.get);
  fastify.get('/:id', leituraController.getParamId);
  fastify.post('/', leituraController.post);
  fastify.put('/:id', leituraController.putParamId);
  fastify.delete('/:id', leituraController.deleteParamId);
}
export default leituraRoutes;