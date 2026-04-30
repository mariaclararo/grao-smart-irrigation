import type { FastifyInstance } from 'fastify';
import { planoController } from '../controllers/PlanoController.js';
import { deletePlanoParamIdSchema, getPlanoParamIdSchema, getPlanoSchema, postPlanoSchema, putPlanoParamIdSchema } from '../schemas/plano.schema';

//função seta com todas rotas para plano
async function planoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getPlanoSchema, planoController.get);
  fastify.get('/:id', getPlanoParamIdSchema, planoController.getParamId);
  fastify.post('/', postPlanoSchema, planoController.post);
  fastify.put('/:id', putPlanoParamIdSchema, planoController.putParamId);
  fastify.delete('/:id', deletePlanoParamIdSchema, planoController.deleteParamId);
}
export default planoRoutes;