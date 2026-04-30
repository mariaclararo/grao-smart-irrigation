import { format } from "node:path"

export const leituraSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        valor: { type: 'number' },
        timeStamp: { type: 'string', format: 'date-time' },
        sensorRaizId: { type: 'integer' }
    },
} as const


const leituraBodySchema = {
    type: 'object',
    required: ['valor', 'sensorRaizId'],
    properties: {
        valor: { type: 'number' },
        sensorRaizId: { type: 'integer' }
    },
} as const

export const getLeituraSchema = {
    schema: {
        tags: ['Leituras'],
        summary: 'Lista todas as leituras realizadas pelos sensores',
        response: { 200: { type: 'array', items: leituraSchema } },
    },
}

export const getLeituraParamIdSchema = {
    schema: {
        tags: ['Leituras'],
        summary: 'Obtém uma leitura pelo ID',
        response: { 200: leituraSchema,},
    },
}

export const postLeituraSchema = {
    schema: {
        tags: ['Leituras'],
        summary: 'Cadastra uma nova leitura',
        body: leituraBodySchema,
        response: { 201: leituraSchema },
    },
}

export const putLeituraParamIdSchema = {
    schema: {
        tags: ['Leituras'],
        summary: 'Atualiza uma leitura pelo ID',
        body: leituraBodySchema,
        response: { 200: leituraSchema },
    },
}

export const deleteLeituraParamIdSchema = {
    schema: {
        tags: ['Leituras'],
        summary: 'Exclui uma leitura do sistema pelo ID',
        response: { 200: leituraSchema },
    },
}