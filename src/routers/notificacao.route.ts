import type { FastifyInstance } from 'fastify';
import { notificacaoController } from '../controllers/NotificacaoController.js';
import { deleteNotificacaoParamIdSchema, getNotificacaoParamIdSchema, getNotificacaoSchema, postNotificacaoSchema, putNotificacaoParamIdSchema } from '../schemas/notificacao.schema';

//função seta com todas rotas para notificacao
async function notificacaoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getNotificacaoSchema, notificacaoController.get);
  fastify.get('/:id', getNotificacaoParamIdSchema, notificacaoController.getParamId);
  fastify.post('/', postNotificacaoSchema, notificacaoController.post);
  fastify.put('/:id', putNotificacaoParamIdSchema, notificacaoController.putParamId);
  fastify.delete('/:id', deleteNotificacaoParamIdSchema, notificacaoController.deleteParamId);
}
export default notificacaoRoutes;

