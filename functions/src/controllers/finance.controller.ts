import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../db/prisma';
import { z } from 'zod';

const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  description: z.string(),
  categoryId: z.string().optional(),
  date: z.string()
});

export async function listTransactionsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    
    const transactions = await prisma.transaction.findMany({
      where: { churchId },
      include: {
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return { success: true, data: transactions, count: transactions.length };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function createTransactionController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!;
    const body = createTransactionSchema.parse(request.body);
    
    const transaction = await prisma.transaction.create({
      data: {
        ...body,
        churchId
      }
    });
    
    return reply.status(201).send({ success: true, data: transaction });
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

export async function updateTransactionController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    const body = createTransactionSchema.partial().parse(request.body);
    
    const transaction = await prisma.transaction.findFirst({
      where: { id, churchId }
    });
    
    if (!transaction) {
      return reply.status(404).send({ success: false, error: 'Transação não encontrada' });
    }
    
    const updated = await prisma.transaction.update({
      where: { id },
      data: body
    });
    
    return { success: true, data: updated };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}

export async function deleteTransactionController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const churchId = request.churchId!;
    
    const transaction = await prisma.transaction.findFirst({
      where: { id, churchId }
    });
    
    if (!transaction) {
      return reply.status(404).send({ success: false, error: 'Transação não encontrada' });
    }
    
    await prisma.transaction.delete({
      where: { id }
    });
    
    return { success: true, message: 'Transação removida' };
  } catch (error: any) {
    return reply.status(500).send({ success: false, error: error.message });
  }
}
