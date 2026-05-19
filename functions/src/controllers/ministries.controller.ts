import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import {
  createMinistrySchema,
  updateMinistrySchema,
} from '../validators/ministries.validator'

export async function listMinistriesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId

    if (!churchId) {
      return reply.status(401).send({
        success: false,
        error: 'Church context not found',
      })
    }

    const ministries = await prisma.ministry.findMany({
      where: {
        churchId,
        status: 'active',
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      success: true,
      data: ministries,
      count: ministries.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createMinistryController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId

    if (!churchId) {
      return reply.status(401).send({
        success: false,
        error: 'Church context not found',
      })
    }

    const body = createMinistrySchema.parse(request.body)

    const ministry = await prisma.ministry.create({
      data: {
        ...body,
        churchId,
        status: 'active',
      },
    })

    return reply.status(201).send({
      success: true,
      data: ministry,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid ministry data',
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

export async function updateMinistryController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId

    if (!churchId) {
      return reply.status(401).send({
        success: false,
        error: 'Church context not found',
      })
    }

    const body = updateMinistrySchema.parse(request.body)

    const ministry = await prisma.ministry.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!ministry) {
      return reply.status(404).send({
        success: false,
        error: 'Ministry not found',
      })
    }

    const updated = await prisma.ministry.update({
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

export async function deleteMinistryController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId

    if (!churchId) {
      return reply.status(401).send({
        success: false,
        error: 'Church context not found',
      })
    }

    const ministry = await prisma.ministry.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!ministry) {
      return reply.status(404).send({
        success: false,
        error: 'Ministry not found',
      })
    }

    await prisma.ministry.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    })

    return {
      success: true,
      message: 'Ministry removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
