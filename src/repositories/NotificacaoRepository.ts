//define diretamente as operações PRISMA que permitem CRUD: create, read(findAll et findById), update e delete

import { prisma } from '../../lib/prisma.js'
import type { Notificacao } from '../../generated/prisma/client.js';

export class NotificacaoRepository {
    //promete que quando o banco retornar com o findMany, vai entregar uma lista de notificacaoes (Notificacao[])

    public async findAll(): Promise<Notificacao[]> {
        return prisma.notificacao.findMany({});
    }
    public async findById(id: number): Promise<Notificacao | null> {
        return prisma.notificacao.findUnique({ where: { id: id } });
    }
    //da omit no id do Notificacao pois é autoincrement no banco
    //data == dado que ele vai receber
    public async create(data: Omit<Notificacao, 'id' | 'dataEnvio' | 'usuarioId'> & { usuarioId: number }): Promise<Notificacao>{
        return prisma.notificacao.create({ 
            data:{
                mensagem: data.mensagem,
                usuario: { connect: {id: data.usuarioId}}
                //lida ja tem default no banco como false
            } });
    }
    //passa o id para identificar, e deixa o data como partial (omitindo apenas o id para n deixar alterar o id)
    //para que o usuário possa dar update apenas nas features que desejar
    public async update(id: number, 
        data: Partial<Omit<Notificacao, 'id' | 'dataEnvio' | 'usuarioId'> & { usuarioId: number }>): Promise<Notificacao> {
        return prisma.notificacao.update({ where: { id: id }, data }); //da update somente nos campos que não estão undefined
    }
    public async delete(id: number): Promise<Notificacao> {
        return prisma.notificacao.delete({ where: { id: id } });
    }
}