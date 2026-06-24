import { z } from 'zod'
import { passwordSchema } from './password.validation'

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  email: z.string().min(1, 'Email обязателен').email('Некорректный email'),
})

export const changePasswordSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().optional(),
    oldPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Подтвердите новый пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type ProfileFormData = z.infer<typeof profileSchema>
