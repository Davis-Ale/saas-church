import { FastifyInstance } from 'fastify'
import {
  createMemberController,
  deleteMemberController,
  listMembersController,
  updateMemberController,
} from '../controllers/members.controller'
import {
  createMemberBodySchema,
  listMembersQuerySchema,
  memberIdParamsSchema,
  updateMemberBodySchema,
} from '../validators/members.validator'

export async function membersRoutes(fastify: FastifyInstance) {
  // LIST
  fastify.get(
    '/',
    {
      schema: {
        querystring: listMembersQuerySchema,
        tags: ['Members'],
        summary: 'List members',
      },
    },
    listMembersController,
  )

  // CREATE
  fastify.post(
    '/',
    {
      schema: {
        body: createMemberBodySchema,
        tags: ['Members'],
        summary: 'Create member',
      },
    },
    createMemberController,
  )

  // UPDATE
  fastify.put(
    '/:id',
    {
      schema: {
        params: memberIdParamsSchema,
        body: updateMemberBodySchema,
        tags: ['Members'],
        summary: 'Update member',
      },
    },
    updateMemberController,
  )

  // DELETE
  fastify.delete(
    '/:id',
    {
      schema: {
        params: memberIdParamsSchema,
        tags: ['Members'],
        summary: 'Delete member',
      },
    },
    deleteMemberController,
  )
}