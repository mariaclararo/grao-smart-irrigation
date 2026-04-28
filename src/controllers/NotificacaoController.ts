import type { FastifyRequest, FastifyReply } from 'fastify';
import { NotificacaoRepository } from '../repositories/NotificacaoRepository.js';
import type { Notificacao } from '../../generated/prisma/client.js';

export class NotificacaoController {
    //use funções de seta para manter contexto do atributo
    private notificacaoRepository = new NotificacaoRepository();

    // POST /notificacaoes -> para criar um notificacao, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<Notificacao, 'id' | 'dataEnvio' | 'usuarioId'> & { usuarioId: number } }>,
            reply: FastifyReply) => {
        const notificacao = request.body; //aqui a informação para criar o notificacao é passada no corpo do http
        const json = await this.notificacaoRepository.create(notificacao); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto notificacao criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /notificacaoes -> para pegar todos os notificacaoes (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.notificacaoRepository.findAll();//espera o promise da lista de notificacaoes
        reply.status(200).send(json); //retorna a lista de notificacaoes em formato json
    };

    // GET /notificacaoes/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.notificacaoRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o notificacao identificado ou nulo, se achar o notificacao retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Notificacao not found' }); //se o retorno for null não achou o notificacao
        }
    };

    // PUT /notificacaoes/{id} -> update de notificacao identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Notificacao, 'id' | 'dataEnvio' | 'usuarioId'> & { usuarioId: number }}>, //passa o que quer alterar do notificacao identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.notificacaoRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Notificacao not found' });
        }
    };

    // DELETE /notificacaoes/{id} ->deleta notificacao identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.notificacaoRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Notificacao not found' });
        }
    };
}

// Exporta a instância do controller
export const notificacaoController = new NotificacaoController();