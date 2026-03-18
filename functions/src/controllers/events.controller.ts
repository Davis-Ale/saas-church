import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  price: z.number().optional(),
  maxAttendees: z.number().optional()
});

export async function listEventsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const events = await prisma.event.findMany({
      where: { churchId },
      include: {
        registrations: {
          include: {
            member: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    
    return { success: true, data: events, count: events.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createEventController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createEventSchema.parse(request.body);
    
    const event = await prisma.event.create({
      data: {
        ...body,
        churchId,
        status: 'active'
      }
    });
    
    return reply.status(201).send({ success: true, data: event });
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

export async function updateEventController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createEventSchema.partial().parse(request.body);
    
    const event = await prisma.event.findFirst({
      where: { id, churchId }
    });
    
    if (!event) {
      return reply.status(404).send({ success: false, error: 'Evento não encontrado' });
    }
    
    const updated = await prisma.event.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deleteEventController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const event = await prisma.event.findFirst({
      where: { id, churchId }
    });
    
    if (!event) {
      return reply.status(404).send({ success: false, error: 'Evento não encontrado' });
    }
    
    await prisma.event.update({
      where: { id },
      data: { status: 'inactive' }
    });
    
    return { success: true, message: 'Evento removido' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
