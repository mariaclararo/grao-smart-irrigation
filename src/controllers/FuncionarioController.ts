import type { FastifyRequest, FastifyReply } from 'fastify';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository.js';
import type { CreateFuncionarioDTO } from '../repositories/FuncionarioRepository.js';
import type { Funcionario } from '../../generated/prisma/client.js';

export class FuncionarioController {
    private funcionarioRepository = new FuncionarioRepository();

    //create
    post = async (
        request: FastifyRequest<{
            Body: CreateFuncionarioDTO
        }>,
        reply: FastifyReply) => {
        const funcionario = request.body; //aqui a informação para criar o poder é passada no corpo do http
        const json = await this.funcionarioRepository.create(funcionario); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto poder criado retornado pela função create dps de ser executada pelo prisma
    };

    //read
    get = async (
        request: FastifyRequest,
        reply: FastifyReply) => {
        const json = await this.funcionarioRepository.findAll();
        reply.status(200).send(json); 
    };

    //read
    getParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.funcionarioRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json);
        } else {
            reply.status(404).send({ message: 'Funcionario not found' });
        }
    };

    //update
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: CreateFuncionarioDTO}>, 
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; 

        try {
            const json = await this.funcionarioRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            console.log(error)
            reply.status(404).send({ message: 'Funcionario not found' });
        }
    };

    //delete
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.funcionarioRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Funcionario not found' });
        }
    };
}

export const funcionarioController = new FuncionarioController();