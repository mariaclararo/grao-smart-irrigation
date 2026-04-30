import type { FastifyInstance } from 'fastify';
import { leituraController } from '../controllers/LeituraController.js';
import { deleteLeituraParamIdSchema, getLeituraParamIdSchema, getLeituraSchema, postLeituraSchema, putLeituraParamIdSchema } from '../schemas/leitura.schema.js';
//função seta com todas rotas para leitura
async function leituraRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getLeituraSchema, leituraController.get);
  fastify.get('/:id', getLeituraParamIdSchema, leituraController.getParamId);
  fastify.post('/', postLeituraSchema,leituraController.post);
  fastify.put('/:id', putLeituraParamIdSchema, leituraController.putParamId);
  fastify.delete('/:id', deleteLeituraParamIdSchema, leituraController.deleteParamId);
}
export default leituraRoutes;