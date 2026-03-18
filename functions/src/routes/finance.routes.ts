import { FastifyInstance } from 'fastify';
import { 
  listTransactionsController, 
  createTransactionController,
  updateTransactionController,
  deleteTransactionController
} from '../controllers/finance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function financeRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listTransactionsController);
  fastify.post('/', createTransactionController);
  fastify.put('/:id', updateTransactionController);
  fastify.delete('/:id', deleteTransactionController);
}
