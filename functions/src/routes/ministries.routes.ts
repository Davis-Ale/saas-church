import { FastifyInstance } from 'fastify';
import { 
  listMinistriesController, 
  createMinistryController,
  updateMinistryController,
  deleteMinistryController
} from '../controllers/ministries.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function ministryRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listMinistriesController);
  fastify.post('/', createMinistryController);
  fastify.put('/:id', updateMinistryController);
  fastify.delete('/:id', deleteMinistryController);
}
