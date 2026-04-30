import type { FastifyInstance } from 'fastify';
import { dispositivoController } from '../controllers/DispositivoController.js';
import { deleteDispositivoParamIdSchema, getDispositivoParamIdSchema, getDispositivoSchema, postDispositivoSchema, putDispositivoParamIdSchema } from '../schemas/dispositivo.schema.js';
//função seta com todas rotas para dispositivo
async function dispositivoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getDispositivoSchema, dispositivoController.get);
  fastify.get('/:id',getDispositivoParamIdSchema, dispositivoController.getParamId);
  fastify.post('/', postDispositivoSchema,dispositivoController.post);
  fastify.put('/:id', putDispositivoParamIdSchema, dispositivoController.putParamId);
  fastify.delete('/:id',deleteDispositivoParamIdSchema, dispositivoController.deleteParamId);
}
export default dispositivoRoutes;


