'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/shared/lib/validations'
import { FormField } from '@/shared/ui/FormField'
import { login } from '@/features/auth/model/auth.api'
import { useAuth } from '@/features/auth'

export function LoginPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      await refreshUser()
      router.push('/')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Неверный email или пароль'
      setError('password', { message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">[добро пожаловать]</p>
              <h1 className="heading-page text-gray-900 uppercase leading-[0.95] tracking-tight mb-6">
                ПРОДОЛЖИ
                <br />
                СВОЁ
                <br />
                ПУТЕШЕСТВИЕ
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                Войди в свой аккаунт и получи доступ ко всем возможностям BikeRoutes.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <FormField
                label="Email"
                type="email"
                placeholder="example@mail.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <FormField
                label="Пароль"
                type="password"
                placeholder="Ваш пароль"
                error={errors.password?.message}
                {...register('password')}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-[12px] font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Нет аккаунта?{' '}
                  <Link href="/register" className="font-bold text-gray-900 hover:underline">
                    Зарегистрироваться
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
