const planoSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nome: { type: 'string' },
        limiteHectares: { type: 'number' },
        precoMensal: { type: 'number' },
        situacao: { type: 'string' },
        ativo: { type: 'boolean' }
    },
} as const


const planoBodySchema = {
    type: 'object',
    required: ['nome', 'limiteHectares', 'precoMensal', 'situacao', 'ativo'],
    properties: {
        nome: { type: 'string' },
        limiteHectares: { type: 'number' },
        precoMensal: { type: 'number' },
        situacao: { type: 'string'},
        ativo: { type: 'boolean' }
    },
} as const

export const getPlanoSchema = {
    schema: {
        tags: ['Planos'],
        summary: 'Lista todos os planos vinculados ao sistema',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: planoSchema } },
    },
}

export const getPlanoParamIdSchema = {
    schema: {
        tags: ['Planos'],
        summary: 'Obtém um plano pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: planoSchema,},
    },
}

export const postPlanoSchema = {
    schema: {
        tags: ['Planos'],
        summary: 'Cadastra um novo plano',
        security: [{ bearerAuth: [] }],
        body: planoBodySchema,
        response: { 201: planoSchema },
    },
}

export const putPlanoParamIdSchema = {
    schema: {
        tags: ['Planos'],
        summary: 'Atualiza um plano pelo ID',
        security: [{ bearerAuth: [] }],
        body: planoBodySchema,
        response: { 200: planoSchema },
    },
}

export const deletePlanoParamIdSchema = {
    schema: {
        tags: ['Planos'],
        summary: 'Exclui um plano do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: planoSchema },
    },
}