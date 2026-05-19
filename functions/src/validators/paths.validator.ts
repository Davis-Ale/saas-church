import { z } from 'zod'

export const createPathSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(1).optional(),
  order: z.number().optional(),
})

export const updatePathSchema = createPathSchema.partial()

export type CreatePathBody = z.infer<typeof createPathSchema>
export type UpdatePathBody = z.infer<typeof updatePathSchema>
