//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Cultura } from '../../generated/prisma/client.js';

export class CulturaRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de culturaes (Cultura[])
    public async findAll(): Promise<Cultura[]> {
        return prisma.cultura.findMany();
    }
    public async findById(id: number): Promise<Cultura | null> {
        return prisma.cultura.findUnique({ where: { id: id } });
    }
    //da omit no id do Cultura pois é autoincrement no banco
    //data == dado que ele vai receber
    public async create(data: Omit<Cultura, 'id'>): Promise<Cultura>{
        return prisma.cultura.create({ data });
    }
    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number, 
        data: Partial<Omit<Cultura, 'id'>>): Promise<Cultura> {
        return prisma.cultura.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }
    public async delete(id: number): Promise<Cultura> {
        return prisma.cultura.delete({ where: { id: id } });
    }
}