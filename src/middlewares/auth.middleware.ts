import jwt from 'jsonwebtoken';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { jwtSecret } from '../utils/jwtSecret.js';

//verifica se na requisição que ele ta mandando tem o token jwt
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;
    if (!authHeader) { //se o autorization veio nulo quer dizer q eu n tenho token
        reply.status(401).send({ message: 'Token ausente' });
        return;
    }
    const token = authHeader.split(' ')[1]; //tira espaço em branco se tiver vindo junto com o token
    
    if (!token) {
        reply.status(401).send({ message: 'Token ausente' });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        (request as any).user = decoded;
    } catch {
        reply.status(401).send({ message: 'Token inválido' });
    }
}