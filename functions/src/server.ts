import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import memberRoutes from './routes/members.routes';
import smallGroupRoutes from './routes/smallGroups.routes';
import pathRoutes from './routes/paths.routes';
import ministryRoutes from './routes/ministries.routes';
import eventRoutes from './routes/events.routes';
import financeRoutes from './routes/finance.routes';
import authRoutes from './routes/auth.routes';

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3002;

async function start() {
  try {
    await fastify.register(cors);
    await fastify.register(helmet);
    
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: { 
          title: 'SaaS Church API', 
          version: '1.0.0',
          description: 'Complete API for church management - 6 modules'
        }
      }
    });
    
    await fastify.register(swaggerUi, {
      routePrefix: '/docs'
    });
    
    fastify.get('/api/health', async () => ({ 
      success: true, 
      message: 'SaaS Church API - 6 modules ready' 
    }));
    
    await fastify.register(memberRoutes, { prefix: '/api/members' });
    await fastify.register(smallGroupRoutes, { prefix: '/api/small-groups' });
    await fastify.register(pathRoutes, { prefix: '/api/paths' });
    await fastify.register(ministryRoutes, { prefix: '/api/ministries' });
    await fastify.register(eventRoutes, { prefix: '/api/events' });
    await fastify.register(financeRoutes, { prefix: '/api/finance' });
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log('Server: http://localhost:' + PORT);
    console.log('Swagger: http://localhost:' + PORT + '/docs');
    console.log('All 6 modules loaded');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
