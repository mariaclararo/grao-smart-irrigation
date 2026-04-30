//schema simplificado para não ter dependência ciclíca, mas conseguir retornar um array de dispositivos associados ao resumo
const dispositivoSimplesSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        macAddress: { type: 'string' },
        nivelBateria: { type: 'number' }
    }
} as const

//o que vai ser mostrado
export const resumoSaudeSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        umidadeMedia: { type: 'number' },
        plantacaoExibidaId: { type: 'integer' },
        alertaDispositivos: { 
            type: 'array', 
            items: dispositivoSimplesSchema }
    },
} as const

//o que o usuario vai enviar no body do json para fazer o post
const resumoSaudeBodySchema = {
    type: 'object',
    required: ['umidadeMedia', 'plantacaoExibidaId', 'dispositivosIds'],
    properties: {
        umidadeMedia: { type: 'number' },
        plantacaoExibidaId: { type: 'integer' },
        dispositivosIds: { 
            type: 'array', 
            items: { type: 'integer' } 
        } //ai vincula como chave estrangeira
    },
} as const

export const getResumoSaudeSchema = {
    schema: {
        tags: ['Resumos de Saúde'],
        summary: 'Lista todas os resumos de saúde da plantação',
        response: { 200: { type: 'array', items: resumoSaudeSchema } },
    },
}

export const getResumoSaudeParamIdSchema = {
    schema: {
        tags: ['Resumos de Saúde'],
        summary: 'Obtém um resumo de saúde pelo ID',
        response: { 200: resumoSaudeSchema,},
    },
}

export const postResumoSaudeSchema = {
    schema: {
        tags: ['Resumos de Saúde'],
        summary: 'Cadastra um novo resumo de saúde',
        body: resumoSaudeBodySchema,
        response: { 201: resumoSaudeSchema },
    },
}

export const putResumoSaudeParamIdSchema = {
    schema: {
        tags: ['Resumos de Saúde'],
        summary: 'Atualiza um resumo de saúde pelo ID',
        body: resumoSaudeBodySchema,
        response: { 200: resumoSaudeSchema },
    },
}

export const deleteResumoSaudeParamIdSchema = {
    schema: {
        tags: ['Resumos de Saúde'],
        summary: 'Exclui uma resumo de saúde do sistema pelo ID',
        response: { 200: resumoSaudeSchema },
    },
}