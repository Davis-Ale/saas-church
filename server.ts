import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import routes from './routes';

const fastify = Fastify({ logger: true });

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    await fastify.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    });
    
    await fastify.register(helmet);
    
    await fastify.register(routes, { prefix: '/api' });
    
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error);
      reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Internal Server Error'
      });
    });
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`Ì∫Ä Server running on http://localhost:${PORT}`);
    console.log(`Ì≥ä API: http://localhost:${PORT}/api`);
    console.log(`‚ù§Ô∏è  Health: http://localhost:${PORT}/api/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
