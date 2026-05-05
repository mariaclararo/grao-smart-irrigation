const loginSchema = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        senha: { type: 'string' },
    },
} as const

const loginResponseSchema = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        token: { type: 'string' }, //token criado com o return token no controller
    },
} as const

export const getAuthSchema = {
    schema: {
        tags: ['Auth'],
        summary: 'Autentica um usuário e retorna um token JWT',
        body: loginSchema,
        response: { 200: loginResponseSchema },
    },
}