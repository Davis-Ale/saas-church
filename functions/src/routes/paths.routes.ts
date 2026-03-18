import { FastifyInstance } from 'fastify';
import { 
  listPathsController, 
  createPathController,
  updatePathController,
  deletePathController
} from '../controllers/paths.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function pathRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listPathsController);
  fastify.post('/', createPathController);
  fastify.put('/:id', updatePathController);
  fastify.delete('/:id', deletePathController);
}
