import type { FastifyRequest, FastifyReply } from 'fastify';
import { LeituraRepository } from '../repositories/LeituraRepository.js';
import type { Leitura } from '../../generated/prisma/client.js';

export class LeituraController {
    //use funções de seta para manter contexto do atributo
    private leituraRepository = new LeituraRepository();

    // POST /leituraes -> para criar um leitura, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
        request: FastifyRequest<{
            Body: Omit<Leitura, 'id' | 'dataHora' | 'sensorId'> & { sensorId: number }
        }>,
        reply: FastifyReply) => {
        const leitura = request.body; //aqui a informação para criar o leitura é passada no corpo do http
        const json = await this.leituraRepository.create(leitura); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto leitura criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /leituraes -> para pegar todos os leituraes (não tem parâmetros)
    get = async (
        request: FastifyRequest,
        reply: FastifyReply) => {
        const json = await this.leituraRepository.findAll();//espera o promise da lista de leituraes
        reply.status(200).send(json); //retorna a lista de leituraes em formato json
    };

    // GET /leituraes/{id}
    //id é params pois é passado na URL
    getParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.leituraRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o leitura identificado ou nulo, se achar o leitura retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Leitura not found' }); //se o retorno for null não achou o leitura
        }
    };

    // PUT /leituraes/{id} -> update de leitura identificado pela url
    putParamId = async (
        request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Leitura, 'id' | 'dataHora' | 'sensorId'> & { sensorId: number }
        }>, //passa o que quer alterar do leitura identificado, não podendo mexer no id autoincrementado pelo banco
        reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.leituraRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Leitura not found' });
        }
    };

    // DELETE /leituraes/{id} ->deleta leitura identificado pela URL
    deleteParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.leituraRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Leitura not found' });
        }
    };
}

// Exporta a instância do controller
export const leituraController = new LeituraController();