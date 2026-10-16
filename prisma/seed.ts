import { prisma } from '../lib/prisma.js'

async function main() {
    console.log('🌱 Sincronizando os planos do sistema Grão...');

    await Promise.all([
        prisma.plano.upsert({
            where: { id: 1 },
            update: { nome: 'G.R.A.O Start', limiteHectares: 20, precoMensal: 450.0 },
            create: { id: 1, nome: 'G.R.A.O Start', limiteHectares: 20, precoMensal: 450.0 },
        }),
        prisma.plano.upsert({
            where: { id: 2 },
            update: { nome: 'G.R.A.O Prime', limiteHectares: 100, precoMensal: 900.0 },
            create: { id: 2, nome: 'G.R.A.O Prime', limiteHectares: 100, precoMensal: 900.0 },
        }),
        prisma.plano.upsert({
            where: { id: 3 },
            update: { nome: 'G.R.A.O Master', limiteHectares: 9999, precoMensal: 1500.0 },
            create: { id: 3, nome: 'G.R.A.O Master', limiteHectares: 9999, precoMensal: 1500.0 },
        }),
    ]);

    await prisma.$queryRaw`
        SELECT setval(
            pg_get_serial_sequence('"Plano"', 'id'),
            (SELECT MAX(id) FROM "Plano")
        )
    `;

    console.log('✅ Planos sincronizados sem remover os demais dados.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });