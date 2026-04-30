import type { FastifyInstance } from 'fastify';
import { funcionarioController } from '../controllers/FuncionarioController';
import { deleteFuncionarioParamIdSchema, getFuncionarioParamIdSchema, getFuncionarioSchema, postFuncionarioSchema, putFuncionarioParamIdSchema } from '../schemas/funcionario.schema';

//define as rotas para endpoint raiz '/'
export async function funcionarioRoutes(fastify: FastifyInstance) {
    fastify.get('/', getFuncionarioSchema, funcionarioController.get);
    fastify.get('/:id', getFuncionarioParamIdSchema, funcionarioController.getParamId);
    fastify.post('/', postFuncionarioSchema, funcionarioController.post);
    fastify.put('/:id', putFuncionarioParamIdSchema, funcionarioController.putParamId);
  fastify.delete('/:id', deleteFuncionarioParamIdSchema, funcionarioController.deleteParamId);
}

export default funcionarioRoutes; 