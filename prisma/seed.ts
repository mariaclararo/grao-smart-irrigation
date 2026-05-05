import { prisma } from '../lib/prisma.js'
import argon2 from 'argon2';

async function main() {
    console.log('🌱 Iniciando o seed do sistema Grão...');

    // Limpeza opcional: Garante um estado limpo antes de inserir (cuidado em produção)
    // Se usar 'migrate reset', não precisa destas linhas
    await prisma.leitura.deleteMany();
    await prisma.sensor.deleteMany();
    await prisma.dispositivo.deleteMany();
    await prisma.notificacao.deleteMany();
    await prisma.resumoSaude.deleteMany();
    await prisma.setor.deleteMany();
    await prisma.cultura.deleteMany();
    await prisma.plantacao.deleteMany();
    await prisma.funcionario.deleteMany();
    await prisma.produtor.deleteMany();
    await prisma.plano.deleteMany();
    await prisma.usuario.deleteMany();

    const senhaHash = await argon2.hash('senha123'); // Senha padrão para todos os testes

    // 1. PLANOS
    const planos = await Promise.all([
        prisma.plano.create({ data: { nome: 'Plano Básico', limiteHectares: 50, precoMensal: 99.9, situacao: 'pago', ativo: true } }),
        prisma.plano.create({ data: { nome: 'Plano Profissional', limiteHectares: 200, precoMensal: 299.9, situacao: 'pago', ativo: true } }),
        prisma.plano.create({ data: { nome: 'Plano Enterprise', limiteHectares: 1000, precoMensal: 899.9, situacao: 'pago', ativo: true } }),
    ]);

    // 2. USUÁRIOS E PRODUTORES (Relação 1:1)[cite: 10, 15]
    const produtor1 = await prisma.produtor.create({
        data: {
            cnpj: '11.111.111/0001-11',
            plano: { connect: { id: planos[0].id } },
            usuario: { create: { nome: 'João Fazendeiro', email: 'joao@grao.com', senha: senhaHash, tipo: 'PRODUTOR' } }
        },
        include: { usuario: true }
    });

    const produtor2 = await prisma.produtor.create({
        data: {
            cnpj: '22.222.222/0001-22',
            plano: { connect: { id: planos[1].id } },
            usuario: { create: { nome: 'Maria Rural', email: 'maria@grao.com', senha: senhaHash, tipo: 'PRODUTOR' } }
        },
        include: { usuario: true }
    });

    const produtor3 = await prisma.produtor.create({
        data: {
            cnpj: '33.333.333/0001-33',
            plano: { connect: { id: planos[2].id } },
            usuario: { create: { nome: 'Carlos Agro', email: 'carlos@grao.com', senha: senhaHash, tipo: 'PRODUTOR' } }
        },
        include: { usuario: true }
    });

    // 3. USUÁRIOS E FUNCIONÁRIOS[cite: 10]
    const funcionarios = await Promise.all([
        prisma.funcionario.create({
            data: { especialidade: 'Agrônomo', empregador: { connect: { id: produtor1.id } },
                    usuario: { create: { nome: 'Felipe Técnico', email: 'felipe@grao.com', senha: senhaHash, tipo: 'FUNCIONARIO' } } }
        }),
        prisma.funcionario.create({
            data: { especialidade: 'Eletricista', empregador: { connect: { id: produtor1.id } },
                    usuario: { create: { nome: 'José Manutenção', email: 'jose@grao.com', senha: senhaHash, tipo: 'FUNCIONARIO' } } }
        }),
        prisma.funcionario.create({
            data: { especialidade: 'Operador', empregador: { connect: { id: produtor2.id } },
                    usuario: { create: { nome: 'Ana Campo', email: 'ana@grao.com', senha: senhaHash, tipo: 'FUNCIONARIO' } } }
        })
    ]);

    // 4. CULTURAS[cite: 10]
    const culturas = await Promise.all([
        prisma.cultura.create({ data: { nome: 'Soja', variedade: 'Transgênica', indiceKc: 1.15 } }),
        prisma.cultura.create({ data: { nome: 'Milho', variedade: 'Híbrido', indiceKc: 1.20 } }),
        prisma.cultura.create({ data: { nome: 'Café', variedade: 'Arábica', indiceKc: 0.95 } }),
    ]);

    // 5. PLANTAÇÕES[cite: 10]
    const plantacoes = await Promise.all([
        prisma.plantacao.create({ data: { nomeFazenda: 'Fazenda Boa Vista', localizacao: 'Minas Gerais', totalHectares: 45, proprietarioId: produtor1.id } }),
        prisma.plantacao.create({ data: { nomeFazenda: 'Sítio das Palmeiras', localizacao: 'São Paulo', totalHectares: 120, proprietarioId: produtor2.id } }),
        prisma.plantacao.create({ data: { nomeFazenda: 'Agro Futuro', localizacao: 'Goiás', totalHectares: 500, proprietarioId: produtor3.id } }),
    ]);

    // 6. SETORES (Relação 1:1 com Cultura e 1:N com Plantação)[cite: 10]
    const setores = await Promise.all([
        prisma.setor.create({ data: { nome: 'Talhão Norte', areaHectares: 15.5, espacamentoTubos: 0.8, plantacaoId: plantacoes[0].id, culturaId: culturas[0].id } }),
        prisma.setor.create({ data: { nome: 'Setor Encosta', areaHectares: 20.0, espacamentoTubos: 1.0, plantacaoId: plantacoes[1].id, culturaId: culturas[1].id } }),
        prisma.setor.create({ data: { nome: 'Vale Principal', areaHectares: 100.0, espacamentoTubos: 0.5, plantacaoId: plantacoes[2].id, culturaId: culturas[2].id } }),
    ]);

    // 7. DISPOSITIVOS[cite: 10]
    const dispositivos = await Promise.all([
        prisma.dispositivo.create({ data: { macAddress: 'AA:BB:CC:DD:EE:01', nivelBateria: 85, setorDeOperacaoId: setores[0].id } }),
        prisma.dispositivo.create({ data: { macAddress: 'AA:BB:CC:DD:EE:02', nivelBateria: 15, setorDeOperacaoId: setores[1].id } }),
        prisma.dispositivo.create({ data: { macAddress: 'AA:BB:CC:DD:EE:03', nivelBateria: 92, setorDeOperacaoId: setores[2].id } }),
    ]);

    // 8. SENSORES[cite: 10]
    const sensores = await Promise.all([
        prisma.sensor.create({ data: { tipo: 'Umidade', unidadeMedida: '%', dispAssociadoId: dispositivos[0].id } }),
        prisma.sensor.create({ data: { tipo: 'Fluxo', unidadeMedida: 'GPH', dispAssociadoId: dispositivos[1].id } }),
        prisma.sensor.create({ data: { tipo: 'Temperatura', unidadeMedida: '°C', dispAssociadoId: dispositivos[2].id } }),
    ]);

    // 9. LEITURAS[cite: 10]
    await Promise.all([
        prisma.leitura.create({ data: { valor: 45.5, sensorRaizId: sensores[0].id } }),
        prisma.leitura.create({ data: { valor: 120.0, sensorRaizId: sensores[1].id } }),
        prisma.leitura.create({ data: { valor: 28.3, sensorRaizId: sensores[2].id } }),
    ]);

    // 10. NOTIFICAÇÕES[cite: 10]
    await Promise.all([
        prisma.notificacao.create({ data: { mensagem: 'Bateria baixa no dispositivo 02', usuarioId: produtor1.usuario.id } }),
        prisma.notificacao.create({ data: { mensagem: 'Relatório de economia disponível', usuarioId: produtor2.usuario.id } }),
        prisma.notificacao.create({ data: { mensagem: 'Novo funcionário cadastrado', usuarioId: produtor1.usuario.id } }),
    ]);

    // 11. RESUMOS DE SAÚDE[cite: 10]
    await Promise.all([
        prisma.resumoSaude.create({ data: { umidadeMedia: 42.5, plantacaoExibidaId: plantacoes[0].id } }),
        prisma.resumoSaude.create({ data: { umidadeMedia: 38.0, plantacaoExibidaId: plantacoes[1].id } }),
        prisma.resumoSaude.create({ data: { umidadeMedia: 45.2, plantacaoExibidaId: plantacoes[2].id } }),
    ]);

    console.log('✅ Seed finalizado com sucesso! Use "senha123" para todos os logins.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });