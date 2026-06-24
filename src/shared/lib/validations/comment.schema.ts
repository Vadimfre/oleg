import { z } from 'zod'

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, 'Комментарий не может быть пустым')
    .max(1000, 'Комментарий не должен превышать 1000 символов')
    .refine((val) => val.trim().length > 0, {
      message: 'Комментарий не может состоять только из пробелов',
    }),
})

export const ratingCommentSchema = z.object({
  comment: z
    .string()
    .max(500, 'Комментарий не должен превышать 500 символов')
    .optional()
    .or(z.literal('')),
})

export type CommentFormData = z.infer<typeof commentSchema>
