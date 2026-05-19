/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'
import {
  listMembersQuerySchema,
  createMemberBodySchema,
  updateMemberBodySchema,
} from '../validators/members.validator'

export async function listMembersController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!
    const query = listMembersQuerySchema.parse(request.query)

    const page = query.page || 1
    const limit = query.limit || 20

    const where = {
      churchId,
      status: 'active',
      ...(query.search && {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' as const } },
          { lastName: { contains: query.search, mode: 'insensitive' as const } },
          { email: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        smallGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.member.count({ where })

    return {
      success: true,
      data: members,
      count: members.length,
      total,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function createMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const churchId = request.churchId!
    const body = createMemberBodySchema.parse(request.body)

    const member = await prisma.member.create({
      data: {
        ...body,
        churchId,
        status: 'active',
      },
    })

    return reply.status(201).send({
      success: true,
      data: member,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid member data'

    return reply.status(400).send({
      success: false,
      error: message,
    })
  }
}

export async function updateMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!
    const body = updateMemberBodySchema.parse(request.body)

    const existingMember = await prisma.member.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!existingMember) {
      return reply.status(404).send({
        success: false,
        error: 'Member not found',
      })
    }

    const member = await prisma.member.update({
      where: {
        id,
      },
      data: body,
    })

    return {
      success: true,
      data: member,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}

export async function deleteMemberController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const churchId = request.churchId!

    const existingMember = await prisma.member.findFirst({
      where: {
        id,
        churchId,
      },
    })

    if (!existingMember) {
      return reply.status(404).send({
        success: false,
        error: 'Member not found',
      })
    }

    await prisma.member.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    })

    return {
      success: true,
      message: 'Member removed',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'

    return reply.status(500).send({
      success: false,
      error: message,
    })
  }
}
