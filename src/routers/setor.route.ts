import type { FastifyInstance } from 'fastify';
import { setorController } from '../controllers/SetorController.js';
import { deleteSetorParamIdSchema, getSetorParamIdSchema, getSetorSchema, postSetorSchema, putSetorParamIdSchema } from '../schemas/setor.schema.js';

//função seta com todas rotas para setor
async function setorRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getSetorSchema, setorController.get);
  fastify.get('/:id', getSetorParamIdSchema, setorController.getParamId);
  fastify.post('/', postSetorSchema, setorController.post);
  fastify.put('/:id', putSetorParamIdSchema, setorController.putParamId);
  fastify.delete('/:id', deleteSetorParamIdSchema, setorController.deleteParamId);
}
export default setorRoutes;


