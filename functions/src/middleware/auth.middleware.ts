import { FastifyRequest, FastifyReply } from 'fastify';

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
  // MOCK: Por enquanto só passa (implementar JWT depois)
  request.user = {
    id: 'mock-user-id',
    email: 'mock@test.com',
    churchId: 'mock-church-id'
  };
}
