import { FastifyRequest, FastifyReply } from 'fastify';

export async function tenantMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    return reply.status(401).send({ error: 'Não autenticado' });
  }
  
  request.churchId = request.user.churchId;
}
