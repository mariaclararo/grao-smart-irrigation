import type { FastifyInstance } from 'fastify';
import { resumoSaudeController } from '../controllers/ResumoSaudeController.js';
import { deleteResumoSaudeParamIdSchema, getResumoSaudeParamIdSchema, getResumoSaudeSchema, postResumoSaudeSchema, putResumoSaudeParamIdSchema } from '../schemas/resumoSaude.schema';


//função seta com todas rotas para resumoSaude
async function resumoSaudeRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', getResumoSaudeSchema, resumoSaudeController.get);
  fastify.get('/:id', getResumoSaudeParamIdSchema, resumoSaudeController.getParamId);
  fastify.post('/', postResumoSaudeSchema, resumoSaudeController.post);
  fastify.put('/:id', putResumoSaudeParamIdSchema, resumoSaudeController.putParamId);
  fastify.delete('/:id', deleteResumoSaudeParamIdSchema, resumoSaudeController.deleteParamId);
}

export default resumoSaudeRoutes;