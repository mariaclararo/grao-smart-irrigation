import { prisma } from '../../lib/prisma.js';
import type { Produtor, Usuario } from '../../generated/prisma/client.js';
import { omitUndefined } from '../utils/omitUndefined.js';

//CRUD -> create, read, update, delete

// Criamos um tipo que contém os dados de Usuario (sem ID) e de Produtor (sem ID)
// Omitimos também o 'tipo' do Usuário, pois no repositório do Produtor ele será sempre 'PRODUTOR'
export type CreateProdutorDTO = Omit<Usuario, 'id' | 'tipo'> & Omit<Produtor, 'id' | 'planoId'> & { planoId: number };

export class ProdutorRepository {
    //read
    public async findAll(): Promise<Produtor[]> {
        return prisma.produtor.findMany({ include: { usuario: true, plano: true } }); //retornar os dados q são herdados de usuario tbm e o plano
    }
    //read
    public async findById(id: number): Promise<Produtor | null> {
        return prisma.produtor.findUnique({ where: { id: id }, include: { usuario: true, plano: true } },);
    }
    //create
    public async create(data: CreateProdutorDTO): Promise<Produtor> {
        return prisma.produtor.create({
            data: {
                cnpj: data.cnpj,
                // Conectamos ao plano já existente no banco
                plano: {
                    connect: { id: data.planoId }
                },
                // Aqui o Prisma cria o registro na tabela Usuario primeiro
                // e usa o ID gerado para criar o Produtor 
                usuario: {
                    create: {
                        nome: data.nome,
                        email: data.email,
                        senha: data.senha,
                        tipo: 'PRODUTOR'
                    }
                }
            },
            // O include garante que o objeto retornado já venha com os dados do usuário
            include: {
                usuario: true
            }
        });
    }
    //update (mudei para resolver problema com id do plano)
    public async update(id: number, data: Partial<CreateProdutorDTO>): Promise<Produtor> {
        const updateData: any = {};

        if (data.cnpj !== undefined) {
            updateData.cnpj = data.cnpj;
        }

        if (data.planoId !== undefined) {
            updateData.plano = {
                connect: { id: data.planoId }
            };
        }

        const usuarioUpdate = omitUndefined({
            nome: data.nome,
            email: data.email,
            senha: data.senha
        });

        if (Object.keys(usuarioUpdate).length > 0) {
            updateData.usuario = {
                update: usuarioUpdate
            };
        }

        return prisma.produtor.update({
            where: { id },
            data: updateData,
            include: { usuario: true, plano: true }
        });
    }
    //delete
    public async delete(id: number): Promise<Produtor> {
        //precisa deletar primeiro produtor (herda) depois usuario (classe mãe)
        //para ainda assim retornar o produtor deletado, usa transaction
        const [deletado] = await prisma.$transaction([
            prisma.produtor.delete({ where: { id: id } }),
            prisma.usuario.delete({ where: { id: id } })
        ])

        return deletado;
    }

}