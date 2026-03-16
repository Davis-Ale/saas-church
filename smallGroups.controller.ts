import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createSmallGroupSchema = z.object({
  name: z.string().min(2),
  leaderId: z.string().optional(),
  address: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional()
});

export async function listSmallGroupsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const smallGroups = await prisma.cell.findMany({
      where: { churchId },
      include: {
        leader: {
          select: { id: true, firstName: true, lastName: true }
        },
        members: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return { success: true, data: smallGroups, count: smallGroups.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createSmallGroupController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createSmallGroupSchema.parse(request.body);
    
    const smallGroup = await prisma.cell.create({
      data: {
        ...body,
        churchId,
        status: 'active'
      }
    });
    
    return reply.status(201).send({ success: true, data: smallGroup });
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

export async function updateSmallGroupController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createSmallGroupSchema.partial().parse(request.body);
    
    const smallGroup = await prisma.cell.findFirst({
      where: { id, churchId }
    });
    
    if (!smallGroup) {
      return reply.status(404).send({ success: false, error: 'Grupo não encontrado' });
    }
    
    const updated = await prisma.cell.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deleteSmallGroupController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const smallGroup = await prisma.cell.findFirst({
      where: { id, churchId }
    });
    
    if (!smallGroup) {
      return reply.status(404).send({ success: false, error: 'Grupo não encontrado' });
    }
    
    await prisma.cell.update({
      where: { id },
      data: { status: 'inactive' }
    });
    
    return { success: true, message: 'Grupo removido' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
