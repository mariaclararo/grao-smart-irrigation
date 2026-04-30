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

//para retornar melhor do que só o id -> consegue infos do plano junto em uma unica requisição
const planoSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        nome: { type: 'string' },
        limiteHectares: { type: 'number' },
        precoMensal: { type: 'number' },
        situacao: { type: 'string' },
        ativo: { type: 'boolean' }
    }
} as const

const produtorSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        cnpj: { type: 'string' },
        planoId: { type: 'integer' },
        usuario: usuarioSchema,
        plano: planoSchema
    },
} as const

const produtorBodySchema = {
    type: 'object',
    required: ['nome', 'email', 'senha', 'cnpj', 'planoId'],
    properties: {
        nome: { type: 'string' },
        email: { type: 'string' },
        senha: { type: 'string' },
        cnpj: { type: 'string' },
        planoId: { type: 'integer' }
    },
} as const

export const getProdutorSchema = {
    schema: {
        tags: ['Produtores'],
        summary: 'Lista todos os produtores com usuários no sistema',
        response: { 200: { type: 'array', items: produtorSchema } },
    },
}

export const getProdutorParamIdSchema = {
    schema: {
        tags: ['Produtores'],
        summary: 'Obtém um produtor pelo ID',
        response: { 200: produtorSchema, },
    },
}

export const postProdutorSchema = {
    schema: {
        tags: ['Produtores'],
        summary: 'Cadastra um novo produtor',
        body: produtorBodySchema,
        response: { 201: produtorSchema },
    },
}

export const putProdutorParamIdSchema = {
    schema: {
        tags: ['Produtores'],
        summary: 'Atualiza um produtor pelo ID',
        body: produtorBodySchema,
        response: { 200: produtorSchema },
    },
}

export const deleteProdutorParamIdSchema = {
    schema: {
        tags: ['Produtores'],
        summary: 'Exclui um produtor do sistema pelo ID',
        response: { 200: produtorSchema },
    },
}