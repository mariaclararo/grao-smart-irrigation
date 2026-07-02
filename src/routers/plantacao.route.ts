import type { FastifyInstance } from 'fastify';
import { plantacaoController } from '../controllers/PlantacaoController.js';
import { deletePlantacaoParamIdSchema, getPlantacaoParamIdSchema, getPlantacaoSchema, postPlantacaoSchema, putPlantacaoParamIdSchema } from '../schemas/plantacao.schema';

//função seta com todas rotas para plantacao
async function plantacaoRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getPlantacaoSchema, plantacaoController.get);
  fastify.get('/:id', getPlantacaoParamIdSchema, plantacaoController.getParamId);
  fastify.post('/', postPlantacaoSchema, plantacaoController.post);
  fastify.put('/:id', putPlantacaoParamIdSchema, plantacaoController.putParamId);
  fastify.delete('/:id', deletePlantacaoParamIdSchema, plantacaoController.deleteParamId);
  fastify.post('/:id/diagnostico', plantacaoController.gerarDiagnostico.bind(plantacaoController));
}
export default plantacaoRoutes;
