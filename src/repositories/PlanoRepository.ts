//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Plano } from '../../generated/prisma/client.js';

export class PlanoRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de planoes (Plano[])
    public async findAll(): Promise<Plano[]> {
        return prisma.plano.findMany();
    }
    public async findById(id: number): Promise<Plano | null> {
        return prisma.plano.findUnique({ where: { id: id } });
    }
    //da omit no id do Plano pois é autoincrement no banco
    //data == dado que ele vai receber
    public async create(data: Omit<Plano, 'id'>): Promise<Plano>{
        return prisma.plano.create({ data });
    }
    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number, 
        data: Partial<Omit<Plano, 'id'>>): Promise<Plano> {
        return prisma.plano.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }
    public async delete(id: number): Promise<Plano> {
        return prisma.plano.delete({ where: { id: id } });
    }
}