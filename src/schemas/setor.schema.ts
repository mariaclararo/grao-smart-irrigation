const setorSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nome: { type: 'string' },
        areaHectares: { type: 'number' },
        espacamentoTubos: { type: 'number' },
        plantacaoId: { type: 'integer' },
        culturaId: { type: 'integer' },

        plantacao: {
            type: 'object',
            nullable: true,
            properties: {
                proprietarioId: { type: 'integer' },
                nomeFazenda: { type: 'string' }
            }
        },

        cultura: {
            type: 'object',
            nullable: true,
            properties: {
                id: { type: 'integer' },
                nome: { type: 'string' },
                variedade: { type: 'string' },
                indiceKc: { type: 'number' }
            }
        }
    },
} as const

const setorBodySchema = {
    type: 'object',
    required: ['nome', 'areaHectares', 'espacamentoTubos', 'plantacaoId', 'culturaId'],
    properties: {
        nome: { type: 'string' },
        areaHectares: { type: 'number' },
        espacamentoTubos: { type: 'number' },
        plantacaoId: { type: 'integer' },
        culturaId: { type: 'integer' }
    },
} as const

export const getSetorSchema = {
    schema: {
        tags: ['Setores'],
        summary: 'Lista todos os setores presentes na plantação',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: setorSchema } },
    },
}

export const getSetorParamIdSchema = {
    schema: {
        tags: ['Setores'],
        summary: 'Obtém um setor pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: setorSchema, },
    },
}

export const postSetorSchema = {
    schema: {
        tags: ['Setores'],
        summary: 'Cadastra um novo setor',
        security: [{ bearerAuth: [] }],
        body: setorBodySchema,
        response: { 201: setorSchema },
    },
}

export const putSetorParamIdSchema = {
    schema: {
        tags: ['Setores'],
        summary: 'Atualiza um setor pelo ID',
        security: [{ bearerAuth: [] }],
        body: setorBodySchema,
        response: { 200: setorSchema },
    },
}

export const deleteSetorParamIdSchema = {
    schema: {
        tags: ['Setores'],
        summary: 'Exclui um setor do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: setorSchema },
    },
}