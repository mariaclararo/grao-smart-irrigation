import type { FastifyRequest, FastifyReply } from 'fastify';
import { ResumoSaudeRepository } from '../repositories/ResumoSaudeRepository.js';
import type { ResumoSaude } from '../../generated/prisma/client.js';

export class ResumoSaudeController {
    //use funções de seta para manter contexto do atributo
    private resumoSaudeRepository = new ResumoSaudeRepository();

    // POST /resumoSaudees -> para criar um resumoSaude, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<ResumoSaude, 'id'> }>,
            reply: FastifyReply) => {
        const resumoSaude = request.body; //aqui a informação para criar o resumoSaude é passada no corpo do http
        const json = await this.resumoSaudeRepository.create(resumoSaude); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto resumoSaude criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /resumoSaudees -> para pegar todos os resumoSaudees (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.resumoSaudeRepository.findAll();//espera o promise da lista de resumoSaudees
        reply.status(200).send(json); //retorna a lista de resumoSaudees em formato json
    };

    // GET /resumoSaudees/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.resumoSaudeRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o resumoSaude identificado ou nulo, se achar o resumoSaude retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'ResumoSaude not found' }); //se o retorno for null não achou o resumoSaude
        }
    };

    // PUT /resumoSaudees/{id} -> update de resumoSaude identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<ResumoSaude, 'id'>}>, //passa o que quer alterar do resumoSaude identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.resumoSaudeRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'ResumoSaude not found' });
        }
    };

    // DELETE /resumoSaudees/{id} ->deleta resumoSaude identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.resumoSaudeRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'ResumoSaude not found' });
        }
    };
}

// Exporta a instância do controller
export const resumoSaudeController = new ResumoSaudeController();