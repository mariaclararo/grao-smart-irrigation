import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import * as authRepository from '../repositories/auth.repository.js';

export const loginController = async (request: FastifyRequest<{
    Body: {
        email: string,
        senha: string //recebe usuario(email) e senha que vem pelo body da requisição
    }
}>, reply: FastifyReply): Promise<void> => {

    const { email, senha } = request.body;

    //verifica se nao estao nulos
    if (!email || !senha) {
        reply.status(400).send({ message: 'Email e senha são obrigatórios.' });
        return;
    }

    const usuario = await authRepository.findUsuariobyemail(email);

    if (!usuario) {
        reply.status(401).send({ message: 'Usuário não encontrado.' });
        return;
    }

    const senhaValida = await argon2.verify(usuario.senha, senha); //usa o argon para verificar se as senhas são as mesmas
    if (!senhaValida) {
        reply.status(401).send({ message: 'Senha inválida.' });
        return;
    }

    //se a senha for válida eu devolvo o token (assinatura jwt)
    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
        process.env.JWT_SECRET || 'secret', //esse secret é uma variável de inicialização do jwt, linha no arquivo .env
        { expiresIn: '1h' } //tem prazo de uma hora, dps precisa solicitar token novamente
    );
    reply.status(200).send({ message: 'Login realizado com sucesso!', token });
};