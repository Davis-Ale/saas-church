import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      churchId: string;
    };
    churchId?: string;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, churchId: true, status: true }
    });
    
    if (!user || user.status !== 'active') {
      return reply.status(403).send({ error: 'Usuário inativo' });
    }
    
    request.user = {
      id: user.id,
      email: user.email,
      churchId: user.churchId
    };
    
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' });
  }
}
