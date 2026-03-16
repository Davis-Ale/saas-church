import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createMemberSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  cellId: z.string().optional()
});

export async function listMembersController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const members = await prisma.member.findMany({
      where: { churchId },
      include: {
        cell: {
          select: { id: true, name: true }
        }
      },
      orderBy: { firstName: 'asc' }
    });
    
    return { success: true, data: members, count: members.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createMemberSchema.parse(request.body);
    
    // Verificar email duplicado
    if (body.email) {
      const existing = await prisma.member.findFirst({
        where: { email: body.email, churchId }
      });
      
      if (existing) {
        return reply.status(400).send({ 
          success: false, 
          error: 'Email já cadastrado' 
        });
      }
    }
    
    const member = await prisma.member.create({
      data: {
        ...body,
        churchId,
        status: 'active',
        serviceApproved: true
      }
    });
    
    return reply.status(201).send({ success: true, data: member });
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

export async function updateMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createMemberSchema.partial().parse(request.body);
    
    const member = await prisma.member.findFirst({
      where: { id, churchId }
    });
    
    if (!member) {
      return reply.status(404).send({ success: false, error: 'Membro não encontrado' });
    }
    
    const updated = await prisma.member.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deleteMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const member = await prisma.member.findFirst({
      where: { id, churchId }
    });
    
    if (!member) {
      return reply.status(404).send({ success: false, error: 'Membro não encontrado' });
    }
    
    await prisma.member.update({
      where: { id },
      data: { status: 'inactive' }
    });
    
    return { success: true, message: 'Membro removido' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
