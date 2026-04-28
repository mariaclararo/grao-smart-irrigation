import type { FastifyInstance } from 'fastify';
import { produtorController } from '../controllers/ProdutorController';

//define as rotas para endpoint raiz '/'
export async function produtorRoutes(fastify: FastifyInstance) {
    fastify.get('/', produtorController.get);
    fastify.get('/:id', produtorController.getParamId);
    fastify.post('/', produtorController.post);
    fastify.put('/:id', produtorController.putParamId);
  fastify.delete('/:id', produtorController.deleteParamId);
}

export default produtorRoutes;