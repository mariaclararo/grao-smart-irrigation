import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import produtorRoutes from './routers/produtor.route.js';
import funcionarioRoutes from './routers/funcionario.route.js';
import planoRoutes from './routers/plano.route.js';
import resumoSaudeRoutes from './routers/resumoSaude.route.js';
import plantacaoRoutes from './routers/plantacao.route.js';
import setorRoutes from './routers/setor.route.js';
import culturaRoutes from './routers/cultura.route.js';
import dispositivoRoutes from './routers/dispositivo.route.js';
import sensorRoutes from './routers/sensor.route.js';
import leituraRoutes from './routers/leitura.route.js';
import notificacaoRoutes from './routers/notificacao.route.js';

const app = Fastify({ logger: true }); //instância Fastify

//ajustes para usar o swagger
await app.register(cors, {
    origin: "*",
    methods: "*",
});

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'GRAO API',
            description: 'API REST PROJECT - PBLC01',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
})

await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(produtorRoutes, { prefix: '/produtores' });
app.register(funcionarioRoutes, { prefix: '/funcionarios' })
app.register(planoRoutes, { prefix: '/planos' })
app.register(resumoSaudeRoutes, { prefix: '/resumosSaude' })
app.register(plantacaoRoutes, { prefix: '/plantacoes' })
app.register(setorRoutes, { prefix: '/setores' })
app.register(culturaRoutes, { prefix: '/culturas' })
app.register(dispositivoRoutes, { prefix: '/dispositivos' })
app.register(sensorRoutes, { prefix: '/sensores' })
app.register(leituraRoutes, { prefix: '/leituras' })
app.register(notificacaoRoutes, { prefix: '/notificacoes' })

const start = async () => { // Função assíncrona chamada start
    try { // Inicia o servidor na porta 3000
        await app.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    } catch (err) { //registra no log caso erro ao iniciar
        app.log.error(err);
        process.exit(1);
    }
};

// Executa a função start
start();