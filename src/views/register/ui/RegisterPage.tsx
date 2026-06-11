'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес'
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    // Валидация подтверждения пароля
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
    // Убираем ошибку при изменении поля
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

    // Имитация отправки на сервер
    setTimeout(() => {
      console.log('Регистрация:', formData)
      setIsSubmitting(false)
      // Перенаправление на главную после успешной регистрации
      router.push('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-36 items-center">
          {/* Левая часть - Информация */}
          <div className="space-y-8 ">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">
                [создай аккаунт]
              </p>
              <h1 className="text-[64px] lg:text-[64px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight mb-6">
                НАЧНИ СВОЁ
                ВЕЛОПУТЕШЕСТВИЕ
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                Присоединяйся к сообществу велосипедистов Гродно. 
                Получи доступ к проверенным маршрутам и начни своё приключение.
              </p>
            </div>

            {/* Преимущества */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">ПЕРСОНАЛЬНЫЕ МАРШРУТЫ</h3>
                  <p className="text-sm text-gray-600">Сохраняй избранное и создавай свои маршруты</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">СТАТИСТИКА</h3>
                  <p className="text-sm text-gray-600">Отслеживай свои достижения и прогресс</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-900 rounded-sm flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-1">СООБЩЕСТВО</h3>
                  <p className="text-sm text-gray-600">Делись опытом с другими велосипедистами</p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть - Форма */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-gray-900 text-white py-4 rounded-[12px] font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              {/* Ссылка на вход */}
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
