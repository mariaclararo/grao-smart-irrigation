import type { FastifyRequest, FastifyReply } from 'fastify';
import { SetorRepository } from '../repositories/SetorRepository.js';
import type { Setor } from '../../generated/prisma/client.js';

export class SetorController {
    //use funções de seta para manter contexto do atributo
    private setorRepository = new SetorRepository();

    // POST /setores -> para criar um setor, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<Setor, 'id' | 'plantacaoId' | 'culturaId'> & { plantacaoId: number; culturaId: number; }
            }>,
            reply: FastifyReply) => {
        const setor = request.body; //aqui a informação para criar o setor é passada no corpo do http
        const json = await this.setorRepository.create(setor); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto setor criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /setores -> para pegar todos os setores (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.setorRepository.findAll();//espera o promise da lista de setores
        reply.status(200).send(json); //retorna a lista de setores em formato json
    };

    // GET /setores/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.setorRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o setor identificado ou nulo, se achar o setor retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Setor not found' }); //se o retorno for null não achou o setor
        }
    };

    // PUT /setores/{id} -> update de setor identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Partial<Omit<Setor, 'id' | 'plantacaoId' | 'culturaId'> & { plantacaoId: number; culturaId: number; }>
            }>, //passa o que quer alterar do setor identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body;
        try {
            const json = await this.setorRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Setor not found' });
        }
    };

    // DELETE /setores/{id} ->deleta setor identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.setorRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Setor not found' });
        }
    };
}

// Exporta a instância do controller
export const setorController = new SetorController();