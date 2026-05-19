import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production'

type AuthTokenPayload = {
  userId: string
}

function getBearerToken(request: FastifyRequest) {
  const authorization = request.headers.authorization

  if (!authorization) {
    return null
  }

  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = getBearerToken(request)

  if (!token) {
    return reply.status(401).send({
      success: false,
      error: 'Missing authorization token',
    })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload

    if (!payload.userId) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid authorization token',
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        status: 'active',
      },
      select: {
        id: true,
        email: true,
        churchId: true,
      },
    })

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid authorization token',
      })
    }

    request.user = user
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid authorization token',
    })
  }
}
