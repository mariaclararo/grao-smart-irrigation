import type { FastifyRequest, FastifyReply } from 'fastify';
import { SensorRepository } from '../repositories/SensorRepository.js';
import type { Sensor } from '../../generated/prisma/client.js';

export class SensorController {
    //use funções de seta para manter contexto do atributo
    private sensorRepository = new SensorRepository();

    // POST /sensores -> para criar um sensor, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
            request: FastifyRequest<{ 
            Body: Omit<Sensor, 'id' | 'dispAssociadoId'> & { dispAssociadoId: number } }>,
            reply: FastifyReply) => {
        const sensor = request.body; //aqui a informação para criar o sensor é passada no corpo do http
        const json = await this.sensorRepository.create(sensor); //await para esperar o promise
        reply.status(201).send(json); //json é o objeto sensor criado retornado pela função create dps de ser executada pelo prisma
    };

    // GET /sensores -> para pegar todos os sensores (não tem parâmetros)
    get = async (
            request: FastifyRequest,
            reply: FastifyReply) => {
        const json = await this.sensorRepository.findAll();//espera o promise da lista de sensores
        reply.status(200).send(json); //retorna a lista de sensores em formato json
    };

    // GET /sensores/{id}
    //id é params pois é passado na URL
    getParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.sensorRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o sensor identificado ou nulo, se achar o sensor retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Sensor not found' }); //se o retorno for null não achou o sensor
        }
    };

    // PUT /sensores/{id} -> update de sensor identificado pela url
    putParamId = async (
            request: FastifyRequest<{
            Params: { id: string },
            Body: Omit<Sensor, 'id' | 'dispAssociadoId'> & { dispAssociadoId: number }}>, //passa o que quer alterar do sensor identificado, não podendo mexer no id autoincrementado pelo banco
            reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.sensorRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Sensor not found' });
        }
    };

    // DELETE /sensores/{id} ->deleta sensor identificado pela URL
    deleteParamId = async (
            request: FastifyRequest<{ 
            Params: { id: string } }>,
            reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.sensorRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Sensor not found' });
        }
    };
}

// Exporta a instância do controller
export const sensorController = new SensorController();