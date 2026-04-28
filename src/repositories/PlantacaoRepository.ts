//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Plantacao } from '../../generated/prisma/client.js';
import { omitUndefined } from '../utils/omitUndefined.js';

// DTO: Dados da plantação + dados do primeiro setor obrigatório
export type CreatePlantacaoDTO = Omit<Plantacao, 'id' | 'proprietarioId'> & {
    proprietarioId: number;
    // Dados para o setor inicial (composição)
    nomeSetor: string;
    areaSetor: number;
    espacamentoTubos: number;
    culturaId: number;
};

export class PlantacaoRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de plantacaoes (Plantacao[])
    public async findAll(): Promise<Plantacao[]> {
        return prisma.plantacao.findMany({
            include: { proprietario: { include: { usuario: true } }, setores: true }
        });
    }

    public async findById(id: number): Promise<Plantacao | null> {
        return prisma.plantacao.findUnique({ where: { id: id }, include: { proprietario: { include: { usuario: true } }, setores: { include: { cultura: true } } } });
    }

    //da omit no id do Plantacao pois é autoincrement no banco
    //data == dado que ele vai receber
    //posso ou nao criar com dispositivos vinculados (pois pode n ter nenhum em alerta)
    public async create(data: CreatePlantacaoDTO): Promise<Plantacao> {
        return prisma.plantacao.create({
            data: {
                nomeFazenda: data.nomeFazenda,
                localizacao: data.localizacao,
                totalHectares: data.totalHectares,
                proprietario: { connect: { id: data.proprietarioId } },
                // Criação aninhada do primeiro setor (Composição)
                setores: {
                    create: {
                        nome: data.nomeSetor,
                        areaHectares: data.areaSetor,
                        espacamentoTubos: data.espacamentoTubos,
                        cultura: { connect: { id: data.culturaId } }
                    }
                }
            },
            include: { setores: true }
        });
    }


    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number, data: Partial<CreatePlantacaoDTO>): Promise<Plantacao> {
        const updateData = omitUndefined({
            nomeFazenda: data.nomeFazenda,
            localizacao: data.localizacao,
            totalHectares: data.totalHectares
        });

        return prisma.plantacao.update({
            where: { id },
            data: updateData
        });
    }

    public async delete(id: number): Promise<Plantacao> {
       const deletada = await prisma.$transaction([
        prisma.setor.deleteMany({ where: { plantacaoId: id } }), //0
        prisma.resumoSaude.deleteMany({ where: { plantacaoExibidaId: id } }), //1
        prisma.plantacao.delete({ where: { id } }) //2
    ]);

        return deletada[2];
    }
}