//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Leitura } from '../../generated/prisma/client.js';
import { connect } from 'node:http2';

export class LeituraRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de leituraes (Leitura[])
    public async findAll(): Promise<Leitura[]> {
        return prisma.leitura.findMany();
    }
    public async findById(id: number): Promise<Leitura | null> {
        return prisma.leitura.findUnique({ where: { id: id } });
    }

    public async create(data: Omit<Leitura, 'id' | 'dataHora' | 'sensorId'> & { sensorRaizId: number }): Promise<Leitura> {
        return prisma.leitura.create({
            data: {
                valor: data.valor,
                sensorRaiz: { connect: { id: data.sensorRaizId } }
            }
        });
    }
    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number,
        data: Partial<Omit<Leitura, 'id' | 'dataHora' | 'sensorId'> & { sensorRaizId: number }>): Promise<Leitura> {
        return prisma.leitura.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }

    public async delete(id: number): Promise<Leitura> {
        return prisma.leitura.delete({ where: { id: id } });
    }
}