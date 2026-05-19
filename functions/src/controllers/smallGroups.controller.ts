/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'
import {
  createSmallGroupSchema,
  updateSmallGroupSchema,
} from '../validators/smallGroups.validator'

export async function listSmallGroupsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!

    const smallGroups = await prisma.smallGroup.findMany({
      where: {
        churchId,
        status: 'active',
      },
      include: {
        members: {
          where: {
            status: 'active',
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      success: true,
      data: smallGroups,
      count: smallGroups.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createSmallGroupController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!
    const body = createSmallGroupSchema.parse(request.body)

    const smallGroup = await prisma.smallGroup.create({
      data: {
        ...body,
        churchId,
        status: 'active',
      },
    })

    return reply.status(201).send({
      success: true,
      data: smallGroup,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid small group data'

    return reply.status(400).send({
      success: false,
      error: message,
    })
  }
}

export async function updateSmallGroupController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!
    const body = updateSmallGroupSchema.parse(request.body)

    const existingSmallGroup = await prisma.smallGroup.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!existingSmallGroup) {
      return reply.status(404).send({
        success: false,
        error: 'Small group not found',
      })
    }

    const smallGroup = await prisma.smallGroup.update({
      where: {
        id,
      },
      data: body,
    })

    return {
      success: true,
      data: smallGroup,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function deleteSmallGroupController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!

    const existingSmallGroup = await prisma.smallGroup.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!existingSmallGroup) {
      return reply.status(404).send({
        success: false,
        error: 'Small group not found',
      })
    }

    await prisma.smallGroup.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    })

    return {
      success: true,
      message: 'Small group removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
