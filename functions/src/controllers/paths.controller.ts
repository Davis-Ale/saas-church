import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createPathSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  order: z.number().optional()
});

export async function listPathsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const paths = await prisma.path.findMany({
      where: { churchId },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    return { success: true, data: paths, count: paths.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createPathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createPathSchema.parse(request.body);
    
    const path = await prisma.path.create({
      data: {
        ...body,
        churchId,
        status: 'active'
      }
    });
    
    return reply.status(201).send({ success: true, data: path });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Invalid data',
        details: error.errors
      });
    }
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function updatePathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createPathSchema.partial().parse(request.body);
    
    const path = await prisma.path.findFirst({
      where: { id, churchId }
    });
    
    if (!path) {
      return reply.status(404).send({ success: false, error: 'Path not found' });
    }
    
    const updated = await prisma.path.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deletePathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const path = await prisma.path.findFirst({
      where: { id, churchId }
    });
    
    if (!path) {
      return reply.status(404).send({ success: false, error: 'Path not found' });
    }
    
    await prisma.path.update({
      where: { id },
      data: { status: 'inactive' }
    });
    
    return { success: true, message: 'Path removed' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
