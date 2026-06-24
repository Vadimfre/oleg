'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/shared/lib/validations'
import { FormField } from '@/shared/ui/FormField'
import { register } from '../model/auth.api'
import { useAuth } from '../model/AuthContext'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
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

  if (!isOpen) return null

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      await refreshUser()
      onClose()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации'
      setError('email', { message })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[12px] max-w-[500px] w-full max-h-[90vh] overflow-y-auto animate-slideUp relative"
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
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">[создай аккаунт]</p>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">РЕГИСТРАЦИЯ</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4">
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
            className="w-full bg-gray-900 text-white py-3 rounded-[8px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-gray-900 hover:underline"
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
