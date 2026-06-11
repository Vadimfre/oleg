'use client'

import { useState } from 'react'
import { register } from '../model/auth.api'
import { useAuth } from '../model/AuthContext'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { refreshUser } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      // Обновляем пользователя в контексте
      await refreshUser()
      onClose()
    } catch (error: any) {
      setErrors({ email: error.message })
    } finally {
      setIsSubmitting(false)
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header - по центру */}
        <div className="text-center p-6 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            [создай аккаунт]
          </p>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            РЕГИСТРАЦИЯ
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Имя */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-[8px] border ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:border-gray-900 transition-colors text-gray-900`}
              placeholder="Ваше имя"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-[8px] border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:border-gray-900 transition-colors text-gray-900`}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Пароль */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-[8px] border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:border-gray-900 transition-colors text-gray-900`}
              placeholder="Минимум 6 символов"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Подтверждение пароля */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-[8px] border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              } focus:outline-none focus:border-gray-900 transition-colors text-gray-900`}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-3 rounded-[8px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          {/* Ссылка на вход */}
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
