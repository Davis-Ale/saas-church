import { FastifyInstance } from 'fastify';
import memberRoutes from './members.routes';
import smallGroupRoutes from './smallGroups.routes';

export default async function routes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    return { success: true, message: 'API is running' };
  });
  
  fastify.register(memberRoutes, { prefix: '/members' });
  fastify.register(smallGroupRoutes, { prefix: '/small-groups' });
}
