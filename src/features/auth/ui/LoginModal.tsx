'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/shared/lib/validations'
import { FormField } from '@/shared/ui/FormField'
import { login } from '../model/auth.api'
import { useAuth } from '../model/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
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

  if (!isOpen) return null

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      await refreshUser()
      onClose()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка входа'
      setError('password', { message })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[12px] max-w-[450px] w-full animate-slideUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center p-6 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">[добро пожаловать]</p>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ВХОД</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4">
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
            className="w-full bg-gray-900 text-white py-3 rounded-[8px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-gray-900 hover:underline"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
