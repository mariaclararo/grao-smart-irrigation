//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Setor } from '../../generated/prisma/client.js';

export class SetorRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de setores (Setor[])
    public async findAll(): Promise<Setor[]> {
        return prisma.setor.findMany({
            include: { plantacao: true, cultura: true }
        });
    }
    public async findById(id: number): Promise<Setor | null> {
        return prisma.setor.findUnique({ where: { id: id } });
    }
    //da omit no id do Setor pois é autoincrement no banco
    //data == dado que ele vai receber
    public async create(data: Omit<Setor, 'id' | 'plantacaoId' | 'culturaId'> & {plantacaoId: number; culturaId: number}): Promise<Setor>{
        return prisma.setor.create({
            data : {
                nome: data.nome,
                areaHectares : data.areaHectares,
                espacamentoTubos : data.espacamentoTubos,
                plantacao: { connect: { id: data.plantacaoId } },
                cultura: { connect: { id: data.culturaId } }} });
    }

    public async update(id: number, 
        data: Partial<Omit<Setor, 'id' | 'plantacaoId' | 'culturaId'> & {plantacaoId: number; culturaId: number}>): Promise<Setor> {
        return prisma.setor.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }
    public async delete(id: number): Promise<Setor> {
        return prisma.setor.delete({ where: { id: id } });
    }
}