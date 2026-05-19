/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import {
  createEventSchema,
  updateEventSchema,
} from '../validators/events.validator'

export async function listEventsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!

    const events = await prisma.event.findMany({
      where: {
        churchId,
        status: 'active',
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    return {
      success: true,
      data: events,
      count: events.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const churchId = request.churchId!
    const body = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
      data: {
        ...body,
        churchId,
        status: 'active',
      },
    })

    return reply.status(201).send({
      success: true,
      data: event,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid event data',
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

export async function updateEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!
    const body = updateEventSchema.parse(request.body)

    const event = await prisma.event.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!event) {
      return reply.status(404).send({
        success: false,
        error: 'Event not found',
      })
    }

    const updated = await prisma.event.update({
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

export async function deleteEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!

    const event = await prisma.event.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!event) {
      return reply.status(404).send({
        success: false,
        error: 'Event not found',
      })
    }

    await prisma.event.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    })

    return {
      success: true,
      message: 'Event removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
