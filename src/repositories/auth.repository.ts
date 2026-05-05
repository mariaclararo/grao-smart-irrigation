import { prisma } from '../../lib/prisma.js'

//email tbm é chave única e faz mais sentido ser usado que o id
export const findUsuariobyemail = async (email : string) =>
{
    return prisma.usuario.findUnique({ where: { email }});
}