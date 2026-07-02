//exporta para poder associar com dispositivos
export const sensorSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        tipo: { type: 'string', enum: ['Umidade', 'Fluxo'] },
        unidadeMedida: { type: 'string' },
        dispAssociadoId: { type: 'integer' },
        dispAssociado: {
            type: 'object',
            nullable: true,
            properties: {
                macAddress: { type: 'string' },
                setorDeOperacao: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        nome: { type: 'string' },
                        plantacao: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                proprietarioId: { type: 'integer' }
                            }
                        }
                    }
                }
            }
        }
    },
} as const

const sensorBodySchema = {
    required: ['tipo', 'unidadeMedida', 'dispAssociadoId'],
    properties: {
        tipo: { type: 'string' },
        unidadeMedida: { type: 'string' },
        dispAssociadoId: { type: 'integer' }
    },
} as const

export const getSensorSchema = {
    schema: {
        tags: ['Sensores'],
        summary: 'Lista todas os sensores presentes na plantação',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: sensorSchema } },
    },
}

export const getSensorParamIdSchema = {
    schema: {
        tags: ['Sensores'],
        summary: 'Obtém um sensor pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: sensorSchema,},
    },
}

export const postSensorSchema = {
    schema: {
        tags: ['Sensores'],
        summary: 'Cadastra um novo sensor',
        security: [{ bearerAuth: [] }],
        body: sensorBodySchema,
        response: { 201: sensorSchema },
    },
}

export const putSensorParamIdSchema = {
    schema: {
        tags: ['Sensores'],
        summary: 'Atualiza um sensor pelo ID',
        security: [{ bearerAuth: [] }],
        body: sensorBodySchema,
        response: { 200: sensorSchema },
    },
}

export const deleteSensorParamIdSchema = {
    schema: {
        tags: ['Sensores'],
        summary: 'Exclui um sensor do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: sensorSchema },
    },
}