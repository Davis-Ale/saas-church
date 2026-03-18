import { FastifyInstance } from 'fastify';
import { loginController } from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', loginController);
}
