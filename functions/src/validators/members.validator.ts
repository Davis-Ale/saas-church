import { z } from 'zod'

export const listMembersQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

export const memberIdParamsSchema = z.object({
  id: z.string().min(1),
})

export const createMemberBodySchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1).optional(),
  birthDate: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  smallGroupId: z.string().trim().min(1).optional(),
  serviceApproved: z.boolean().optional(),
})

export const updateMemberBodySchema = createMemberBodySchema.partial()

export type ListMembersQuery = z.infer<typeof listMembersQuerySchema>
export type MemberIdParams = z.infer<typeof memberIdParamsSchema>
export type CreateMemberBody = z.infer<typeof createMemberBodySchema>
export type UpdateMemberBody = z.infer<typeof updateMemberBodySchema>
