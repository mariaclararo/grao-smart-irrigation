import type { FastifyInstance } from 'fastify';
import { culturaController } from '../controllers/CulturaController.js';
import { deleteCulturaParamIdSchema, getCulturaParamIdSchema, getCulturaSchema, postCulturaSchema, putCulturaParamIdSchema} from '../schemas/cultura.schema';

//função seta com todas rotas para cultura
async function culturaRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getCulturaSchema, culturaController.get);
  fastify.get('/:id', getCulturaParamIdSchema, culturaController.getParamId);
  fastify.post('/', postCulturaSchema, culturaController.post);
  fastify.put('/:id', putCulturaParamIdSchema, culturaController.putParamId);
  fastify.delete('/:id', deleteCulturaParamIdSchema, culturaController.deleteParamId);
}
export default culturaRoutes;