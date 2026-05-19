import { z } from 'zod'

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  description: z.string().trim().min(1),
  categoryId: z.string().trim().min(1).optional(),
  date: z.string().trim().min(1),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>
export type UpdateTransactionBody = z.infer<typeof updateTransactionSchema>
