//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Sensor } from '../../generated/prisma/client.js';

export class SensorRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de sensores (Sensor[])
    public async findAll(): Promise<(Sensor & { valorUltimaLeitura: number })[]> {
        const sensores = await prisma.sensor.findMany({ include: { leituras: true } });

        return sensores.map(sensor => ({
            ...sensor,
            valorUltimaLeitura: sensor.leituras && sensor.leituras.length > 0
                ? sensor.leituras[sensor.leituras.length - 1]?.valor ?? 0
                : 0
        }));
    }

    public async findById(id: number): Promise<(Sensor & { valorUltimaLeitura: number }) | null> {
        const sensor = await prisma.sensor.findUnique({ where: { id: id }, include: { leituras: true } });

        if(!sensor) return null;
        return {
            ...sensor,
            valorUltimaLeitura: sensor.leituras && sensor.leituras.length > 0 
                ? sensor.leituras[sensor.leituras.length - 1]?.valor ?? 0 
                : 0
        };
    }

    public async create(data: Omit<Sensor, 'id' | 'dispAssociadoId'> & { dispAssociadoId: number }): Promise<Sensor> {
        return prisma.sensor.create({
            data: {
                tipo: data.tipo,
                unidadeMedida: data.unidadeMedida,
                dispAssociado: { connect: { id: data.dispAssociadoId } }
            },
            include: { leituras: true }
        });
    }

    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number,
        data: Partial<Omit<Sensor, 'id' | 'dispAssociadoId'> & { dispAssociadoId: number }>): Promise<Sensor> {
        return prisma.sensor.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }
    public async delete(id: number): Promise<Sensor> {
        return prisma.sensor.delete({ where: { id: id } });
    }
}