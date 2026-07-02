import type { FastifyRequest, FastifyReply } from 'fastify';
import { PlantacaoRepository } from '../repositories/PlantacaoRepository.js';
import type { CreatePlantacaoDTO } from '../repositories/PlantacaoRepository.js';
import type { Plantacao } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma';

interface IPlantacaoFormInput {
    nomeFazenda: string;
    localizacao: string;
    totalHectares: number;
    cnpjProdutor: string;
    nomeSetor: string;
    areaSetor: number;
    espacamentoTubos: number;
    culturaId: number;
}

export class PlantacaoController {
    //use funções de seta para manter contexto do atributo
    private plantacaoRepository = new PlantacaoRepository();

    // POST /plantacaoes -> para criar um plantacao, omitindo o campo de id pois é autoincrement no banco de dados
    post = async (
        request: FastifyRequest<{
            Body: {
                nomeFazenda: string;
                localizacao: string;
                totalHectares: number;
                cnpjProdutor: string;
                culturaId: number;
            }
        }>,
        reply: FastifyReply) => {
        try {
            const plantacao = request.body;
            const produtorDono = await prisma.produtor.findUnique({
                where: { cnpj: plantacao.cnpjProdutor }
            });

            if (!produtorDono) {
                return reply.status(400).send({
                    message: 'Cadastro não realizado: CNPJ informado não consta no sistema'
                })
            }

            const plantacaoFormatada = {
                nomeFazenda: plantacao.nomeFazenda,
                localizacao: plantacao.localizacao,
                totalHectares: plantacao.totalHectares,
                proprietarioId: produtorDono.id,
                //valores padrão para a palntação criada
                nomeSetor: "Primeiro Setor Geral",
                areaSetor: plantacao.totalHectares,
                espacamentoTubos: 1.0,
                culturaId: plantacao.culturaId
            };
            const json = await this.plantacaoRepository.create(plantacaoFormatada); //await para esperar o promise
            reply.status(201).send(json); //json é o objeto plantacao criado retornado pela função create dps de ser executada pelo prisma
        } catch (error: any) {
            reply.status(400).send({ message: error.message || 'Erro ao cadastrar plantação.' });
        }
    };

    // GET /plantacaoes -> para pegar todos os plantacaoes (não tem parâmetros)
    get = async (
        request: FastifyRequest,
        reply: FastifyReply) => {
        const json = await this.plantacaoRepository.findAll();//espera o promise da lista de plantacaoes
        reply.status(200).send(json); //retorna a lista de plantacaoes em formato json
    };

    // GET /plantacaoes/{id}
    //id é params pois é passado na URL
    getParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,//como faz parte do texto da URL, http considera td como string. Por isso pegamos o id (mesmo que number) como string e depois convertemos para inteiro
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.plantacaoRepository.findById(parseInt(id)); //converte para inteiro para busca
        if (json) {
            reply.status(200).send(json); //como pode retornar o plantacao identificado ou nulo, se achar o plantacao retorna o objeto como json
        } else {
            reply.status(404).send({ message: 'Plantacao not found' }); //se o retorno for null não achou o plantacao
        }
    };

    // PUT /plantacaoes/{id} -> update de plantacao identificado pela url
    putParamId = async (
        request: FastifyRequest<{
            Params: { id: string },
            Body: Partial<CreatePlantacaoDTO>
        }>, //passa o que quer alterar do plantacao identificado, não podendo mexer no id autoincrementado pelo banco
        reply: FastifyReply) => {
        const { id } = request.params;
        const data = request.body; //nome e descrição são as features que podem ser passadas pelo corpo
        //caso não passe uma das duas, o valor dela será undefined

        try {
            const json = await this.plantacaoRepository.update(
                parseInt(id),
                data
            );
            reply.status(200).send(json);
        } catch (error) {
            reply.status(404).send({ message: 'Plantacao not found' });
        }
    };

    // DELETE /plantacaoes/{id} ->deleta plantacao identificado pela URL
    deleteParamId = async (
        request: FastifyRequest<{
            Params: { id: string }
        }>,
        reply: FastifyReply) => {
        const { id } = request.params;
        const json = await this.plantacaoRepository.delete(parseInt(id));

        if (json) {
            reply.status(200).send(json);//se retornou um objeto o delete foi sucesso
        } else {
            reply.status(404).send({ message: 'Plantacao not found' });
        }
    };

    public async gerarDiagnostico(request: any, reply: any) {
        try {
            const { id } = request.params;
            const plantacaoId = Number(id);

            const plantacao = await prisma.plantacao.findUnique({
                where: { id: plantacaoId },
                include: {
                    setores: {
                        include: {
                            dispositivos: {
                                include: {
                                    sensores: {
                                        include: {
                                            leituras: {
                                                orderBy: { timeStamp: 'desc' }, 
                                                take: 1 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!plantacao) {
                return reply.status(404).send({ message: "Plantação não encontrada." });
            }

            let somaUmidade = 0;
            let numSensoresUmidade = 0;
            const dispositivosAlertaIds: number[] = [];

            plantacao.setores.forEach(setor => {
                setor.dispositivos.forEach(disp => {
                    if (disp.nivelBateria <= 20) {
                        dispositivosAlertaIds.push(disp.id);
                    }

                    // Verifica Umidade
                    disp.sensores.forEach(sensor => {
                        if (sensor.tipo === 'Umidade' && sensor.leituras.length > 0) {
                            somaUmidade += sensor.leituras[0]!.valor;
                            numSensoresUmidade++;
                        }
                    });
                });
            });

            const umidadeMedia = numSensoresUmidade > 0 ? (somaUmidade / numSensoresUmidade) : -1;

            const resumo = await prisma.resumoSaude.create({
                data: {
                    umidadeMedia: umidadeMedia,
                    plantacaoExibida: { connect: { id: plantacaoId } },
                    alertaDispositivos: {
                        connect: dispositivosAlertaIds.map(id => ({ id })) 
                    }
                },
                include: { alertaDispositivos: true }
            });

            return reply.status(201).send(resumo);

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Erro interno ao gerar o diagnóstico.' });
        }
    }
}

// Exporta a instância do controller
export const plantacaoController = new PlantacaoController();