import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createMinistrySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional()
});

export async function listMinistriesController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const ministries = await prisma.ministry.findMany({
      where: { churchId },
      include: {
        volunteers: {
          include: {
            member: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return { success: true, data: ministries, count: ministries.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createMinistryController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createMinistrySchema.parse(request.body);
    
    const ministry = await prisma.ministry.create({
      data: {
        ...body,
        churchId,
        status: 'active'
      }
    });
    
    return reply.status(201).send({ success: true, data: ministry });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ 
        success: false, 
        error: 'Dados inválidos',
        details: error.errors
      });
    }
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function updateMinistryController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createMinistrySchema.partial().parse(request.body);
    
    const ministry = await prisma.ministry.findFirst({
      where: { id, churchId }
    });
    
    if (!ministry) {
      return reply.status(404).send({ success: false, error: 'Ministério não encontrado' });
    }
    
    const updated = await prisma.ministry.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deleteMinistryController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const ministry = await prisma.ministry.findFirst({
      where: { id, churchId }
    });
    
    if (!ministry) {
      return reply.status(404).send({ success: false, error: 'Ministério não encontrado' });
    }
    
    await prisma.ministry.update({
      where: { id },
      data: { status: 'inactive' }
    });
    
    return { success: true, message: 'Ministério removido' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
