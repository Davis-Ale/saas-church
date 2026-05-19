import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(1).optional(),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().min(1).optional(),
  price: z.number().optional(),
  maxAttendees: z.number().optional(),
})

export const updateEventSchema = createEventSchema.partial()

export type CreateEventBody = z.infer<typeof createEventSchema>
export type UpdateEventBody = z.infer<typeof updateEventSchema>
