import type { FastifyInstance } from 'fastify';
import { produtorController } from '../controllers/ProdutorController';
import { deleteProdutorParamIdSchema, getProdutorParamIdSchema, getProdutorSchema, postProdutorSchema, putProdutorParamIdSchema } from '../schemas/produtor.schema';


//define as rotas para endpoint raiz '/'
export async function produtorRoutes(fastify: FastifyInstance) {
    fastify.get('/', getProdutorSchema, produtorController.get);
    fastify.get('/:id', getProdutorParamIdSchema, produtorController.getParamId);
    fastify.post('/', postProdutorSchema, produtorController.post);
    fastify.put('/:id', putProdutorParamIdSchema, produtorController.putParamId);
  fastify.delete('/:id', deleteProdutorParamIdSchema, produtorController.deleteParamId);
}

export default produtorRoutes;

