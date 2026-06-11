'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес'
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
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
      console.log('Вход:', formData)
      setIsSubmitting(false)
      // Перенаправление на главную после успешного входа
      router.push('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-[1200px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть - Информация */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide mb-6">
                [добро пожаловать]
              </p>
              <h1 className="text-[64px] lg:text-[80px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight mb-6">
                ПРОДОЛЖИ<br />
                СВОЁ<br />
                ПУТЕШЕСТВИЕ
              </h1>
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                Войди в свой аккаунт и получи доступ ко всем возможностям 
                Эко-навигатор. Твои маршруты ждут тебя.
              </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">6+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Маршрутов</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">50+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Км дорог</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Бесплатно</div>
              </div>
            </div>
          </div>

          {/* Правая часть - Форма */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Ваш пароль"
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Забыли пароль */}
              <div className="text-right">
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                  Забыли пароль?
                </Link>
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-[12px] font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>

              {/* Ссылка на регистрацию */}
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
