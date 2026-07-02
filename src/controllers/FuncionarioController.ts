import type { FastifyRequest, FastifyReply } from 'fastify';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository.js';
import type { CreateFuncionarioDTO } from '../repositories/FuncionarioRepository.js';
import type { Funcionario } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma';

interface IFuncionarioFormInput {
    nome: string;
    email: string;
    senha: string;
    especialidade: string;
    cnpjEmpregador: string;
}

export class FuncionarioController {
    private funcionarioRepository = new FuncionarioRepository();

    //create
    post = async (
        request: FastifyRequest<{
            Body: IFuncionarioFormInput
        }>,
        reply: FastifyReply) => {
        try {
            const funcionario = request.body; //aqui a informação para criar o poder é passada no corpo do http
            const produtorEmpregador = await prisma.produtor.findUnique({
                where: { cnpj: funcionario.cnpjEmpregador }
            });

            if (!produtorEmpregador) {
                return reply.status(400).send({
                    message: 'Cadastro negado: não existe produtor cadastrado com esse CNPJ no sistema'
                })
            }

            const funcionarioFormatado = {
                nome: funcionario.nome,
                email: funcionario.email,
                senha: funcionario.senha,
                especialidade: funcionario.especialidade,
                empregadorId: produtorEmpregador.id
            }
            const json = await this.funcionarioRepository.create(funcionarioFormatado); //await para esperar o promise
            reply.status(201).send(json); //json é o objeto poder criado retornado pela função create dps de ser executada pelo prisma
        } catch (error: any) {
            reply.status(400).send({ message: error.message || 'Erro ao cadastrar funcionário.' });
        }
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
            Body: any
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body as Record<string, any>;

        try {
            const updateData = { ...data};

            if(updateData.senha === ""){
                delete updateData.senha;
            }
            const json = await this.funcionarioRepository.update(
                parseInt(id),
               updateData
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
            Params: { id: string }
        }>,
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