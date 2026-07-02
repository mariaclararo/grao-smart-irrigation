const plantacaoSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nomeFazenda: { type: 'string' },
        localizacao: { type: 'string' },
        totalHectares: { type: 'number' },
        proprietarioId: { type: 'integer' },
        setores: {type: 'array'}
    },
} as const

const plantacaoBodySchema = {
    type: 'object',
    required: ['nomeFazenda', 'localizacao', 'totalHectares'],
    properties: {
        nomeFazenda: { type: 'string' },
        localizacao: { type: 'string' },
        totalHectares: { type: 'number' },
        cnpjProdutor: { type: 'string' },
        culturaId: { type: 'integer' }
    },
} as const

export const getPlantacaoSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Lista todas as plantações cadastradas no sistema',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: plantacaoSchema } },
    },
}

export const getPlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Obtém uma plantação pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: plantacaoSchema,},
    },
}

export const postPlantacaoSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Cadastra uma nova plantação',
        security: [{ bearerAuth: [] }],
        body: plantacaoBodySchema,
        response: { 201: plantacaoSchema },
    },
}

export const putPlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Atualiza uma plantação pelo ID',
        security: [{ bearerAuth: [] }],
        body: plantacaoBodySchema,
        response: { 200: plantacaoSchema },
    },
}

export const deletePlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Exclui uma plantação do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: plantacaoSchema },
    },
}