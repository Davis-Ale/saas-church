import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import { fastifyApiReference } from '@scalar/fastify-api-reference';
import routes from './routes';

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3001;

async function start() {
  try {
    await fastify.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    });
    
    await fastify.register(helmet);
    
    // Swagger
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'SaaS Church API',
          version: '1.0.0'
        }
      }
    });
    
    // Scalar
    await fastify.register(fastifyApiReference, {
      routePrefix: '/reference',
      configuration: {
        spec: { url: '/openapi.json' },
        theme: 'purple',
        darkMode: true
      }
    });
    
    fastify.get('/openapi.json', async () => fastify.swagger());
    
    await fastify.register(routes, { prefix: '/api' });
    
    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error(error);
      reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message
      });
    });
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`íº€ http://localhost:${PORT}`);
    console.log(`í³Š Scalar: http://localhost:${PORT}/reference`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
