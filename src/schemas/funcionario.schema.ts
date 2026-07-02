//schema para dar certo heranca de usuario
const usuarioSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nome: { type: 'string' },
        email: { type: 'string' },
        tipo: { type: 'string' }
    }
} as const

//para evitar dependência circular
const empregadorSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        cnpj: { type: 'string' }
    }
} as const

const funcionarioSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        especialidade: { type: 'string' },
        empregadorId: { type: 'integer' },
        usuario: usuarioSchema,
        empregador: empregadorSchema
    },
} as const


const funcionarioBodySchema = {
    type: 'object',
    required: ['nome', 'email', 'senha', 'especialidade', 'cnpjEmpregador'],
    properties: {
        nome: { type: 'string' },
        email: { type: 'string' },
        senha: { type: 'string' },
        especialidade: { type: 'string' },
        cnpjEmpregador: { type: 'string' }
    },
} as const

export const getFuncionarioSchema = {
    schema: {
        tags: ['Funcionários'],
        summary: 'Lista todos os funcionários com usuários no sistema',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: funcionarioSchema } },
    },
}

export const getFuncionarioParamIdSchema = {
    schema: {
        tags: ['Funcionários'],
        summary: 'Obtém um funcionário pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: funcionarioSchema, },
    },
}

export const postFuncionarioSchema = {
    schema: {
        tags: ['Funcionários'],
        summary: 'Cadastra um novo funcionário',
        security: [{ bearerAuth: [] }],
        body: funcionarioBodySchema,
        response: { 201: funcionarioSchema },
    },
}

export const putFuncionarioParamIdSchema = {
    schema: {
        tags: ['Funcionários'],
        summary: 'Atualiza um funcionário pelo ID',
        security: [{ bearerAuth: [] }],
        body: funcionarioBodySchema,
        response: { 200: funcionarioSchema },
    },
}

export const deleteFuncionarioParamIdSchema = {
    schema: {
        tags: ['Funcionários'],
        summary: 'Exclui um funcionário do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: funcionarioSchema },
    },
}