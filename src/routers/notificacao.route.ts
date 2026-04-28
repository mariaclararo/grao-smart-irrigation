import type { FastifyInstance } from 'fastify';
import { notificacaoController } from '../controllers/NotificacaoController.js';
//função seta com todas rotas para notificacao
async function notificacaoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', notificacaoController.get);
  fastify.get('/:id', notificacaoController.getParamId);
  fastify.post('/', notificacaoController.post);
  fastify.put('/:id', notificacaoController.putParamId);
  fastify.delete('/:id', notificacaoController.deleteParamId);
}
export default notificacaoRoutes;