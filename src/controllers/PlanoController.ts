import type { FastifyRequest, FastifyReply } from 'fastify';
import { PlanoRepository } from '../repositories/PlanoRepository.js';
import type { Plano } from '../../generated/prisma/client.js';

export class PlanoController {
    //use funções de seta para manter contexto do atributo
    private planoRepository = new PlanoRepository();

    // POST /planoes -> para criar um plano, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<Plano, 'id'> }>,
            reply: FastifyReply) => {
        const plano = request.body; //aqui a informação para criar o plano é passada no corpo do http
        const json = await this.planoRepository.create(plano); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto plano criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /planoes -> para pegar todos os planoes (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.planoRepository.findAll();//espera o promise da lista de planoes
        reply.status(200).send(json); //retorna a lista de planoes em formato json
    };

    // GET /planoes/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.planoRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o plano identificado ou nulo, se achar o plano retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Plano not found' }); //se o retorno for null não achou o plano
        }
    };

    // PUT /planoes/{id} -> update de plano identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Plano, 'id'>}>, //passa o que quer alterar do plano identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.planoRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Plano not found' });
        }
    };

    // DELETE /planoes/{id} ->deleta plano identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.planoRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Plano not found' });
        }
    };
}

// Exporta a instância do controller
export const planoController = new PlanoController();