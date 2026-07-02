import { prisma } from '../lib/prisma.js'

async function main() {
    console.log('🌱 Iniciando o seed limpo do sistema Grão (Apenas Planos)...');

    // Limpeza em cascata para garantir que o banco fique completamente vazio
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

    // 1. PLANOS com os valores e limites oficiais do seu Front-End
    await Promise.all([
        prisma.plano.create({ data: { id: 1, nome: 'G.R.A.O Start', limiteHectares: 20, precoMensal: 450.0 } }),
        prisma.plano.create({ data: { id: 2, nome: 'G.R.A.O Prime', limiteHectares: 100, precoMensal: 900.0 } }),
        prisma.plano.create({ data: { id: 3, nome: 'G.R.A.O Master', limiteHectares: 9999, precoMensal: 1500.0 } }),
    ]);

    // SINCRONIZAÇÃO DE SEQUÊNCIAS DO POSTGRESQL (Para os IDs voltarem a começar do 1)
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Usuario"', 'id'), coalesce(max(id), 1)) FROM "Usuario";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Plano"', 'id'), coalesce(max(id), 1)) FROM "Plano";`;

    console.log('✅ Banco de dados resetado! Apenas os planos de assinatura foram inseridos.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });