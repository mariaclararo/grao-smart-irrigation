import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProdutorRepository } from '../repositories/ProdutorRepository.js';
import type { CreateProdutorDTO } from '../repositories/ProdutorRepository.js';
import type { Produtor } from '../../generated/prisma/client.js';

interface IProdutorFormInput {
    nome: string;
    email: string;
    senha: string;
    cnpj: string;
    plano: string; 
}

export class ProdutorController {
    private produtorRepository = new ProdutorRepository();

    //create
    post = async (
        request: FastifyRequest<{
            Body: IProdutorFormInput
        }>,
        reply: FastifyReply) => {
            try{
                const produtor = request.body; //aqui a informação para criar o poder é passada no corpo do http

                let planoIdConvertido = 1; //start é plano default
                if(produtor.plano === 'prime') planoIdConvertido = 2;
                if(produtor.plano === 'master') planoIdConvertido = 3;

                const produtorFormatado = {
                    nome: produtor.nome,
                    email: produtor.email,
                    senha: produtor.senha,
                    cnpj: produtor.cnpj,
                    situacao: 'ativo',
                    ativo: true,
                    planoId: planoIdConvertido
                }

                const json = await this.produtorRepository.create(produtorFormatado); //await para esperar o promise
                reply.status(201).send(json);
            } catch(error: any) {
                reply.status(400).send({ message: error.message || 'Erro ao cadastrar produtor' });
            }
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
            Body: any}>, 
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body as Record<string, any>; 

        try {
            const updateData = { ...data };
            if (updateData.plano) {
                if (updateData.plano === 'start') updateData.planoId = 1;
                if (updateData.plano === 'prime') updateData.planoId = 2;
                if (updateData.plano === 'master') updateData.planoId = 3;
                
                // Remove a propriedade de texto pois o Repositório do Prisma aceita apenas "planoId" numérico
                delete updateData.plano;
            }

            if (updateData.senha === "") {
                delete updateData.senha;
            }
            const json = await this.produtorRepository.update(
                parseInt(id),
                updateData
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