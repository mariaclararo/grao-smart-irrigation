import { sensorSchema } from './sensor.schema';
import { resumoSaudeSchema } from './resumoSaude.schema.js';

const dispositivoSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        macAddress: { type: 'string' },
        nivelBateria: { type: 'integer' },
        setorDeOperacaoId : { type: 'integer' },
        sensores: { type: 'array', items: sensorSchema }, //obrigatorio, mas pode inicializar com vetor vazio
        indicadoResumos: { type: 'array', items: resumoSaudeSchema}
    },
} as const

const dispositivoBodySchema = {
    type: 'object',
    required: ['macAddress', 'nivelBateria', 'setorDeOperacaoId', 'sensores', 'indicadoResumos'],
    properties: {
        macAddress: { type: 'string' },
        nivelBateria: { type: 'integer' },
        setorDeOperacaoId : { type: 'integer' }
    },
} as const

export const getDispositivoSchema = {
    schema: {
        tags: ['Dispositivos'],
        summary: 'Lista todos as dispositivos presentes na plantação',
        security: [{ bearerAuth: [] }],
        response: { 200: { type: 'array', items: dispositivoSchema } },
    },
}

export const getDispositivoParamIdSchema = {
    schema: {
        tags: ['Dispositivos'],
        summary: 'Obtém um dispositivo pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: dispositivoSchema,},
    },
}

export const postDispositivoSchema = {
    schema: {
        tags: ['Dispositivos'],
        summary: 'Cadastra um novo dispositivo',
        security: [{ bearerAuth: [] }],
        body: dispositivoBodySchema,
        response: { 201: dispositivoSchema },
    },
}

export const putDispositivoParamIdSchema = {
    schema: {
        tags: ['Dispositivos'],
        summary: 'Atualiza um dispositivo pelo ID',
        security: [{ bearerAuth: [] }],
        body: dispositivoBodySchema,
        response: { 200: dispositivoSchema },
    },
}

export const deleteDispositivoParamIdSchema = {
    schema: {
        tags: ['Dispositivos'],
        summary: 'Exclui um dispositivo do sistema pelo ID',
        security: [{ bearerAuth: [] }],
        response: { 200: dispositivoSchema },
    },
}