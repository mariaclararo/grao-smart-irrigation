import type { FastifyRequest, FastifyReply } from 'fastify';
import { DispositivoRepository } from '../repositories/DispositivoRepository.js';
import type { Dispositivo } from '../../generated/prisma/client.js';

export class DispositivoController {
    //use funções de seta para manter contexto do atributo
    private dispositivoRepository = new DispositivoRepository();

    // POST /dispositivoes -> para criar um dispositivo, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
        request: FastifyRequest<{
            Body: Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number }
        }>,
        reply: FastifyReply) => {
        const dispositivo = request.body; //aqui a informação para criar o dispositivo é passada no corpo do http
        const json = await this.dispositivoRepository.create(dispositivo); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto dispositivo criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /dispositivoes -> para pegar todos os dispositivoes (não tem parâmetros)
    get = async (
        request: FastifyRequest,
        reply: FastifyReply) => {
        const json = await this.dispositivoRepository.findAll();//espera o promise da lista de dispositivoes
        reply.status(200).send(json); //retorna a lista de dispositivoes em formato json
    };

    // GET /dispositivoes/{id}
    //id é params pois é passado na URL
    getParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.dispositivoRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o dispositivo identificado ou nulo, se achar o dispositivo retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Dispositivo not found' }); //se o retorno for null não achou o dispositivo
        }
    };

    // PUT /dispositivoes/{id} -> update de dispositivo identificado pela url
    putParamId = async (
        request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number }
        }>, //passa o que quer alterar do dispositivo identificado, não podendo mexer no id autoincrementado pelo banco
        reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.dispositivoRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Dispositivo not found' });
        }
    };

    // DELETE /dispositivoes/{id} ->deleta dispositivo identificado pela URL
    deleteParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.dispositivoRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Dispositivo not found' });
        }
    };
}

// Exporta a instância do controller
export const dispositivoController = new DispositivoController();