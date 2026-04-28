import type { FastifyInstance } from 'fastify';
import { funcionarioController } from '../controllers/FuncionarioController';

//define as rotas para endpoint raiz '/'
export async function funcionarioRoutes(fastify: FastifyInstance) {
    fastify.get('/', funcionarioController.get);
    fastify.get('/:id', funcionarioController.getParamId);
    fastify.post('/', funcionarioController.post);
    fastify.put('/:id', funcionarioController.putParamId);
  fastify.delete('/:id', funcionarioController.deleteParamId);
}

export default funcionarioRoutes;