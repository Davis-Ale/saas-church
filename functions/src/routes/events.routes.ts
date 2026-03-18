import { FastifyInstance } from 'fastify';
import { 
  listEventsController, 
  createEventController,
  updateEventController,
  deleteEventController
} from '../controllers/events.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listEventsController);
  fastify.post('/', createEventController);
  fastify.put('/:id', updateEventController);
  fastify.delete('/:id', deleteEventController);
}
