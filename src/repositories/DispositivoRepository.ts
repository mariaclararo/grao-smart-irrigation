//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Dispositivo } from '../../generated/prisma/client.js';

export class DispositivoRepository {

    public async findAll(): Promise<Dispositivo[]> {
        return prisma.dispositivo.findMany({ include: { setorDeOperacao: true } });
    }

    public async findById(id: number): Promise<Dispositivo | null> {
        return prisma.dispositivo.findUnique({
            where: { id: id },
            include: { setorDeOperacao: true }
        });
    }

    public async create(data: Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number }): Promise<Dispositivo> {
        //logica para ajustar mac dnv (descobrir dps se é redundante)
        const mac = data.macAddress.replace(/[:.-]/g, "").trim();

        return prisma.dispositivo.create({
            data: {
                macAddress: mac,
                nivelBateria: data.nivelBateria,
                setorDeOperacao: { connect: { id: data.setorDeOperacaoId } } //connect vincula com setor já persistido
                //se o id n existir lança erro
            },
            include: { sensores: true }
        });
    }

    public async update(id: number,
        data: Partial<Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number }>): Promise<Dispositivo> {
        return prisma.dispositivo.update({ where: { id: id }, data });
    }

    public async delete(id: number): Promise<Dispositivo> {
        return prisma.dispositivo.delete({ where: { id: id } });
    }
}