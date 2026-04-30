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
    required: ['nomeFazenda', 'localizacao', 'totalHectares', 'proprietarioId', 'nomeSetor', 'areaSetor', 'espacamentoTubos', 'culturaId'],
    properties: {
        nomeFazenda: { type: 'string' },
        localizacao: { type: 'string' },
        totalHectares: { type: 'number' },
        proprietarioId: { type: 'integer' },
        nomeSetor: { type: 'string' },
        areaSetor: { type: 'number' },
        espacamentoTubos: { type: 'number' },
        culturaId: { type: 'integer' }
    },
} as const

export const getPlantacaoSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Lista todas as plantações cadastradas no sistema',
        response: { 200: { type: 'array', items: plantacaoSchema } },
    },
}

export const getPlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Obtém uma plantação pelo ID',
        response: { 200: plantacaoSchema,},
    },
}

export const postPlantacaoSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Cadastra uma nova plantação',
        body: plantacaoBodySchema,
        response: { 201: plantacaoSchema },
    },
}

export const putPlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Atualiza uma plantação pelo ID',
        body: plantacaoBodySchema,
        response: { 200: plantacaoSchema },
    },
}

export const deletePlantacaoParamIdSchema = {
    schema: {
        tags: ['Plantações'],
        summary: 'Exclui uma plantação do sistema pelo ID',
        response: { 200: plantacaoSchema },
    },
}