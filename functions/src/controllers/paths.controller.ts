import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import {
  createPathSchema,
  updatePathSchema,
} from '../validators/paths.validator'

export async function listPathsController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!

    const paths = await prisma.path.findMany({
      where: { churchId },
      orderBy: { order: 'asc' },
    })

    return {
      success: true,
      data: paths,
      count: paths.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createPathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!
    const body = createPathSchema.parse(request.body)

    const path = await prisma.path.create({
      data: {
        ...body,
        churchId,
        status: 'active',
      },
    })

    return reply.status(201).send({
      success: true,
      data: path,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid data',
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

export async function updatePathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!
    const body = updatePathSchema.parse(request.body)

    const path = await prisma.path.findFirst({
      where: { id, churchId },
    })

    if (!path) {
      return reply.status(404).send({
        success: false,
        error: 'Path not found',
      })
    }

    const updated = await prisma.path.update({
      where: { id },
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

export async function deletePathController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!

    const path = await prisma.path.findFirst({
      where: { id, churchId },
    })

    if (!path) {
      return reply.status(404).send({
        success: false,
        error: 'Path not found',
      })
    }

    await prisma.path.update({
      where: { id },
      data: { status: 'inactive' },
    })

    return {
      success: true,
      message: 'Path removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
