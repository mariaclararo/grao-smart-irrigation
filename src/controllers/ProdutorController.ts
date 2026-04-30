import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutorRepository } from '../repositories/ProdutorRepository.js';
import type { CreateProdutorDTO } from '../repositories/ProdutorRepository.js';
import type { Produtor } from '../../generated/prisma/client.js';

export class ProdutorController {
    private produtorRepository = new ProdutorRepository();

    //create
    post = async (
        request: FastifyRequest<{
            Body: CreateProdutorDTO
        }>,
        reply: FastifyReply) => {
        const produtor = request.body; //aqui a informação para criar o poder é passada no corpo do http
        const json = await this.produtorRepository.create(produtor); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto poder criado retornado pela função create dps de ser executada pelo prisma
    };

    //read
    get = async (
        request: FastifyRequest,
        reply: FastifyReply) => {
        const json = await this.produtorRepository.findAll();
        reply.status(200).send(json); //retorna a lista de poderes em formato json
    };

    //read
    getParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.produtorRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json);
        } else {
            reply.status(404).send({ message: 'Produtor not found' });
        }
    };

    //update
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: CreateProdutorDTO}>, 
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; 

        try {
            const json = await this.produtorRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            console.log(error)
            reply.status(404).send({ message: 'Produtor not found' });
        }
    };

    //delete
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.produtorRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Produtor not found' });
        }
    };
}

export const produtorController = new ProdutorController();