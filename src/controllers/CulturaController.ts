import type { FastifyRequest, FastifyReply } from 'fastify';
import { CulturaRepository } from '../repositories/CulturaRepository.js';
import type { Cultura } from '../../generated/prisma/client.js';

export class CulturaController {
    //use funções de seta para manter contexto do atributo
    private culturaRepository = new CulturaRepository();

    // POST /culturaes -> para criar um cultura, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<Cultura, 'id'> }>,
            reply: FastifyReply) => {
        const cultura = request.body; //aqui a informação para criar o cultura é passada no corpo do http
        const json = await this.culturaRepository.create(cultura); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto cultura criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /culturaes -> para pegar todos os culturaes (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.culturaRepository.findAll();//espera o promise da lista de culturaes
        reply.status(200).send(json); //retorna a lista de culturaes em formato json
    };

    // GET /culturaes/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.culturaRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o cultura identificado ou nulo, se achar o cultura retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Cultura not found' }); //se o retorno for null não achou o cultura
        }
    };

    // PUT /culturaes/{id} -> update de cultura identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Cultura, 'id'>}>, //passa o que quer alterar do cultura identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.culturaRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Cultura not found' });
        }
    };

    // DELETE /culturaes/{id} ->deleta cultura identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.culturaRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Cultura not found' });
        }
    };
}

// Exporta a instância do controller
export const culturaController = new CulturaController();