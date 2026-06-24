'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/shared/lib/validations'
import { FormField } from '@/shared/ui/FormField'
import { register } from '@/features/auth/model/auth.api'
import { useAuth } from '@/features/auth'

export function RegisterPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      await refreshUser()
      router.push('/')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации'
      setError('email', { message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">[создай аккаунт]</p>
              <h1 className="text-[64px] lg:text-[64px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight mb-6">
                НАЧНИ СВОЁ ВЕЛОПУТЕШЕСТВИЕ
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                Присоединяйся к сообществу велосипедистов Гродно.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <FormField
                label="Имя"
                type="text"
                placeholder="Ваше имя"
                error={errors.name?.message}
                {...registerField('name')}
              />

              <FormField
                label="Email"
                type="email"
                placeholder="example@mail.com"
                error={errors.email?.message}
                {...registerField('email')}
              />

              <FormField
                label="Пароль"
                type="password"
                placeholder="Мин. 8 символов, заглавная, цифра, спецсимвол"
                error={errors.password?.message}
                {...registerField('password')}
              />

              <FormField
                label="Подтверждение пароля"
                type="password"
                placeholder="Повторите пароль"
                error={errors.confirmPassword?.message}
                {...registerField('confirmPassword')}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-[12px] font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Уже есть аккаунт?{' '}
                  <Link href="/login" className="font-bold text-gray-900 hover:underline">
                    Войти
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
