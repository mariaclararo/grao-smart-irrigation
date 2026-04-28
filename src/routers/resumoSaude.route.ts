import type { FastifyInstance } from 'fastify';
import { resumoSaudeController } from '../controllers/ResumoSaudeController.js';
//função seta com todas rotas para resumoSaude
async function resumoSaudeRoutes(fastify: FastifyInstance) {
  // Rota GET /
  fastify.get('/', resumoSaudeController.get);
  fastify.get('/:id', resumoSaudeController.getParamId);
  fastify.post('/', resumoSaudeController.post);
  fastify.put('/:id', resumoSaudeController.putParamId);
  fastify.delete('/:id', resumoSaudeController.deleteParamId);
}
export default resumoSaudeRoutes;