import { prisma } from '../../lib/prisma.js';
import type { Funcionario, Usuario } from '../../generated/prisma/client.js';
import { omitUndefined } from '../utils/omitUndefined.js';
import argon2 from 'argon2';

//CRUD -> create, read, update, delete

// DTO: Omitimos IDs e o tipo (que será fixo como FUNCIONARIO)
export type CreateFuncionarioDTO = Omit<Usuario, 'id' | 'tipo'> & Omit<Funcionario, 'id' | 'empregadorId'> & { empregadorId: number };

export class FuncionarioRepository {
    //read
    public async findAll(): Promise<Funcionario[]> {
        return prisma.funcionario.findMany({include:{usuario: true, empregador:true}}); //retornar os dados q são herdados de usuario tbm e o empregador
    }
    //read
    public async findById(id: number): Promise<Funcionario | null> {
        return prisma.funcionario.findUnique({ where: { id: id }, include:{usuario: true, empregador:true}},);
    }
    //create
    public async create(data: CreateFuncionarioDTO): Promise<Funcionario> {
        const hash = await argon2.hash(data.senha);
        return prisma.funcionario.create({
            data: {
                especialidade: data.especialidade,
                // Conectamos ao empregador já existente no banco
                empregador: {
                    connect: { id: data.empregadorId }
                },
                // Aqui o Prisma cria o registro na tabela Usuario primeiro
                // e usa o ID gerado para criar o Funcionario 
                usuario: {
                    create: {
                        nome: data.nome,
                        email: data.email,
                        senha: hash,
                        tipo: 'FUNCIONARIO'
                    }
                }
            },
            // O include garante que o objeto retornado já venha com os dados do usuário
            include: {
                usuario: true,
                empregador: true
            }
        });
    }

    //update por cada atributo para conseguir manter relacionamento e parcialidade
    public async update(id: number, data: Partial<CreateFuncionarioDTO>): Promise<Funcionario> {
    const updateData: any = {};
    if (data.especialidade !== undefined) {
        updateData.especialidade = data.especialidade;
    }
    if (data.empregadorId !== undefined) {
        updateData.empregador = {
            connect: { id: data.empregadorId }
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
    return prisma.funcionario.update({
        where: { id },
        data: updateData,
        include: { usuario: true }
    });
}
    //delete
    public async delete(id: number): Promise<Funcionario> {
        //precisa deletar primeiro funcionario (herda) depois usuario (classe mãe)
        //para ainda assim retornar o funcionario deletado, usa transaction
        const [deletado] = await prisma.$transaction([
            prisma.funcionario.delete({ where: { id: id } }),
            prisma.usuario.delete({ where: { id: id } })
        ])

        return deletado;
    }

}