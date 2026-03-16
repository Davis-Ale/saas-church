import { FastifyInstance } from 'fastify';
import { 
  listSmallGroupsController, 
  createSmallGroupController,
  updateSmallGroupController,
  deleteSmallGroupController
} from '../controllers/smallGroups.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function smallGroupRoutes(fastify: FastifyInstance) {
  
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listSmallGroupsController);
  fastify.post('/', createSmallGroupController);
  fastify.put('/:id', updateSmallGroupController);
  fastify.delete('/:id', deleteSmallGroupController);
}
