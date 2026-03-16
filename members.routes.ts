import { FastifyInstance } from 'fastify';
import { 
  listMembersController, 
  createMemberController,
  updateMemberController,
  deleteMemberController
} from '../controllers/members.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tenantMiddleware } from '../middleware/tenant.middleware';

export default async function memberRoutes(fastify: FastifyInstance) {
  
  // Aplicar middlewares em todas rotas
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', tenantMiddleware);
  
  fastify.get('/', listMembersController);
  fastify.post('/', createMemberController);
  fastify.put('/:id', updateMemberController);
  fastify.delete('/:id', deleteMemberController);
}
