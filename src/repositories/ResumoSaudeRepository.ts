//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { ResumoSaude } from '../../generated/prisma/client.js';

export class ResumoSaudeRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de resumoSaudees (ResumoSaude[])
    public async findAll(): Promise<ResumoSaude[]> {
        return prisma.resumoSaude.findMany({
            include: { plantacaoExibida: true, alertaDispositivos: true }
        });
    }
    public async findById(id: number): Promise<ResumoSaude | null> {
        return prisma.resumoSaude.findUnique({ where: { id: id }, include: { plantacaoExibida: true, alertaDispositivos: true } });
    }
    //da omit no id do ResumoSaude pois é autoincrement no banco
    //data == dado que ele vai receber
    //posso ou nao criar com dispositivos vinculados (pois pode n ter nenhum em alerta)
    public async create(data: Omit<ResumoSaude, 'id'> & { dispositivosIds?: number[] }): Promise<ResumoSaude> {
        return prisma.resumoSaude.create({
            data: {
                umidadeMedia: data.umidadeMedia,
                plantacaoExibida: {
                    connect: { id: data.plantacaoExibidaId }
                },
                // Conecta múltiplos dispositivos ao resumo (Relação N:N)
                alertaDispositivos: {
                    connect: data.dispositivosIds?.map(id => ({ id })) || []
                }
            },
            include: { alertaDispositivos: true }
        });
    }
    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number,
        data: Partial<Omit<ResumoSaude, 'id'>> & { dispositivosIds?: number[] }): Promise<ResumoSaude> {
        return prisma.resumoSaude.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }

    public async delete(id: number): Promise<ResumoSaude> {
        return prisma.resumoSaude.delete({ where: { id: id } });
    }
}