/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/finance.validator'

export async function listTransactionsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!

    const transactions = await prisma.transaction.findMany({
      where: {
        churchId,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return {
      success: true,
      data: transactions,
      count: transactions.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!
    const body = createTransactionSchema.parse(request.body)

    const transaction = await prisma.transaction.create({
      data: {
        ...body,
        churchId,
      },
    })

    return reply.status(201).send({
      success: true,
      data: transaction,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid transaction data',
        details: error.issues,
      })
    }

    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function updateTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!
    const body = updateTransactionSchema.parse(request.body)

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!transaction) {
      return reply.status(404).send({
        success: false,
        error: 'Transaction not found',
      })
    }

    const updated = await prisma.transaction.update({
      where: {
        id,
      },
      data: body,
    })

    return {
      success: true,
      data: updated,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function deleteTransactionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!transaction) {
      return reply.status(404).send({
        success: false,
        error: 'Transaction not found',
      })
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    })

    return {
      success: true,
      message: 'Transaction removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
