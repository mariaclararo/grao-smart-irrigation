//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Dispositivo } from '../../generated/prisma/client.js';

export class DispositivoRepository {

    public async findAll(): Promise<Dispositivo[]> {
        return prisma.dispositivo.findMany({ include: { setorDeOperacao: {include: { plantacao: true}}, sensores: true, indicadoResumos: true } });
    }

    public async findById(id: number): Promise<Dispositivo | null> {
        return prisma.dispositivo.findUnique({
            where: { id: id },
            include: { setorDeOperacao: true, sensores: true, indicadoResumos: true }
        });
    }

    public async create(data: Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number, sensoresIds: number[], resumosIds: number[] }): Promise<Dispositivo> {
        //logica para ajustar mac dnv (descobrir dps se é redundante)
        const mac = data.macAddress.replace(/[:.-]/g, "").trim();

        return prisma.dispositivo.create({
            data: (() => {
                const createData: any = {
                    macAddress: mac,
                    nivelBateria: data.nivelBateria,
                    setorDeOperacao: { connect: { id: data.setorDeOperacaoId } },
                };
                if (data.sensoresIds) {
                    createData.sensores = { connect: data.sensoresIds.map((id: number) => ({ id })) };
                }
                if (data.resumosIds) {
                    createData.indicadoResumos = { connect: data.resumosIds.map((id: number) => ({ id })) };
                }
                return createData;
            })(),
            include: { setorDeOperacao: true, sensores: true, indicadoResumos: true }
        });
    }

    public async update(id: number,
        data: Partial<Omit<Dispositivo, 'id' | 'setorDeOperacao'> & { setorDeOperacaoId: number, sensoresIds?: number[], resumosIds?: number[] }>): Promise<Dispositivo> {
        //indicando manualmente um por um pq tava dando erro no put c swagger (preciso indicar q sensores pode ser vazio)
        const updateData: any = {};

        if (data.macAddress !== undefined) {
            updateData.macAddress = data.macAddress;
        }

        if (data.nivelBateria !== undefined) {
            updateData.nivelBateria = data.nivelBateria;
        }

        if (data.setorDeOperacaoId !== undefined) {
            updateData.setorDeOperacao = {
                connect: { id: data.setorDeOperacaoId }
            };
        }

        if (data.sensoresIds !== undefined) {
            updateData.sensores = {
                set: data.sensoresIds.map((id: number) => ({ id }))
            };
        }

        if (data.resumosIds !== undefined) {
            updateData.indicadoResumos = {
                set: data.resumosIds.map((id: number) => ({ id }))
            };
        }

        return prisma.dispositivo.update({
            where: { id: id },
            data: updateData
        });
    }

    public async delete(id: number): Promise<Dispositivo> {
        return prisma.dispositivo.delete({ where: { id: id } });
    }
}