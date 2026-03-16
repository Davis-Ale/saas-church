import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../db/prisma'

export async function listMembersController(request: FastifyRequest, reply: FastifyReply) {
  const members = await prisma.member.findMany()
  return { data: members }
}

export async function createMemberController(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any
  const member = await prisma.member.create({ data: body })
  return { data: member }
}

export async function updateMemberController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const body = request.body as any
  const member = await prisma.member.update({ where: { id }, data: body })
  return { data: member }
}

export async function deleteMemberController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  await prisma.member.delete({ where: { id } })
  return { message: 'Deleted' }
}