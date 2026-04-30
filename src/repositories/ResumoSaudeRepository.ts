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
            include: { plantacaoExibida: true, alertaDispositivos: true }
        });
    }

    //só deu certo fazer assim
    public async update(id: number,
        data: Partial<Omit<ResumoSaude, 'id'>> & { dispositivosIds?: number[] }): Promise<ResumoSaude> {
        const updateData: any = {};
        if (data.umidadeMedia !== undefined) updateData.umidadeMedia = data.umidadeMedia;
        if (data.plantacaoExibidaId !== undefined) updateData.plantacaoExibidaId = data.plantacaoExibidaId;
        if (data.dispositivosIds !== undefined) updateData.alertaDispositivos = { set: data.dispositivosIds.map(id => ({ id })) };
        return prisma.resumoSaude.update({
            where: { id: id },
            data: updateData
        }); //da update somente nos campos que não estão undefined
    }


    public async delete(id: number): Promise<ResumoSaude> {
        return prisma.resumoSaude.delete({ where: { id: id } });
    }
}