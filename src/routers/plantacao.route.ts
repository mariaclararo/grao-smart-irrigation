import type { FastifyInstance } from 'fastify';
import { plantacaoController } from '../controllers/PlantacaoController.js';
//função seta com todas rotas para plantacao
async function plantacaoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', plantacaoController.get);
  fastify.get('/:id', plantacaoController.getParamId);
  fastify.post('/', plantacaoController.post);
  fastify.put('/:id', plantacaoController.putParamId);
  fastify.delete('/:id', plantacaoController.deleteParamId);
}
export default plantacaoRoutes;