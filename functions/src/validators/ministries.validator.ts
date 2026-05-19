import { z } from 'zod'

export const createMinistrySchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(1).optional(),
})

export const updateMinistrySchema = createMinistrySchema.partial()

export type CreateMinistryBody = z.infer<typeof createMinistrySchema>
export type UpdateMinistryBody = z.infer<typeof updateMinistrySchema>
