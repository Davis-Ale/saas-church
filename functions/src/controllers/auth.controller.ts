import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = loginSchema.parse(request.body);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true, 
        password: true, 
        churchId: true, 
        status: true 
      }
    });
    
    if (!user || user.status !== 'active') {
      return reply.status(401).send({ success: false, error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return reply.status(401).send({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    return { 
      success: true, 
      token,
      user: {
        id: user.id,
        email: user.email,
        churchId: user.churchId
      }
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ success: false, error: 'Invalid data' });
    }
    return reply.status(500).send({ success: false, error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
