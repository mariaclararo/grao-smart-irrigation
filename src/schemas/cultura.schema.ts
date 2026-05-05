const culturaSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nome: { type: 'string' },
        variedade: { type: 'string' },
        indiceKc: { type: 'number' }
    },
} as const


const culturaBodySchema = {
    type: 'object',
    required: ['nome', 'variedade', 'indiceKc'],
    properties: {
        nome: { type: 'string' },
        variedade: { type: 'string' },
        indiceKc: { type: 'number' }
    },
} as const

export const getCulturaSchema = {
    schema: {
        tags: ['Culturas'],
        summary: 'Lista todas as culturas presentes na plantação',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: culturaSchema } },
    },
}

export const getCulturaParamIdSchema = {
    schema: {
        tags: ['Culturas'],
        summary: 'Obtém uma cultura pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: culturaSchema,},
    },
}

export const postCulturaSchema = {
    schema: {
        tags: ['Culturas'],
        summary: 'Cadastra uma nova cultura',
        security: [{ bearerAuth: [] }],
        body: culturaBodySchema,
        response: { 201: culturaSchema },
    },
}

export const putCulturaParamIdSchema = {
    schema: {
        tags: ['Culturas'],
        summary: 'Atualiza uma cultura pelo ID',
        security: [{ bearerAuth: [] }],
        body: culturaBodySchema,
        response: { 200: culturaSchema },
    },
}

export const deleteCulturaParamIdSchema = {
    schema: {
        tags: ['Culturas'],
        summary: 'Exclui uma cultura do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: culturaSchema },
    },
}