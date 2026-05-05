const notificacaoSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        mensagem: { type: 'string' },
        lida: { type: 'boolean' },
        timeStamp: { type: 'string', format: 'date-time' },
        usuarioId: { type: 'integer' }
    },
} as const

const notificacaoBodySchema = {
    type: 'object',
    required: ['mensagem', 'usuarioId'],
    properties: {
        mensagem: { type: 'string' },
        usuarioId: { type: 'integer' },
        lida: {type: 'boolean', default: false} //assim para não ser obrigatório passar, mas para ser possível atualizar para True quando lida
    },
} as const

export const getNotificacaoSchema = {
    schema: {
        tags: ['Notificações'],
        summary: 'Lista todas as notificações enviadas pelo sistema',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: notificacaoSchema } },
    },
}

export const getNotificacaoParamIdSchema = {
    schema: {
        tags: ['Notificações'],
        summary: 'Obtém uma notificação pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: notificacaoSchema,},
    },
}

export const postNotificacaoSchema = {
    schema: {
        tags: ['Notificações'],
        summary: 'Cadastra uma nova notificação',
        security: [{ bearerAuth: [] }],
        body: notificacaoBodySchema,
        response: { 201: notificacaoSchema },
    },
}

export const putNotificacaoParamIdSchema = {
    schema: {
        tags: ['Notificações'],
        summary: 'Atualiza uma notificação pelo ID',
        security: [{ bearerAuth: [] }],
        body: notificacaoBodySchema,
        response: { 200: notificacaoSchema },
    },
}

export const deleteNotificacaoParamIdSchema = {
    schema: {
        tags: ['Notificações'],
        summary: 'Exclui uma notificação do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: notificacaoSchema },
    },
}