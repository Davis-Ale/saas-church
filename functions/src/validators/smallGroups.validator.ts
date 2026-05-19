import { z } from 'zod'

export const createSmallGroupSchema = z.object({
  name: z.string().trim().min(2),
  leaderId: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  meetingDay: z.string().trim().min(1).optional(),
  meetingTime: z.string().trim().min(1).optional(),
})

export const updateSmallGroupSchema = createSmallGroupSchema.partial()

export type CreateSmallGroupBody = z.infer<typeof createSmallGroupSchema>
export type UpdateSmallGroupBody = z.infer<typeof updateSmallGroupSchema>
