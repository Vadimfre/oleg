'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

// Компонент для анимированного счетчика
function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="heading-hero uppercase tracking-tight leading-none mb-6">
              О нашем<br />сервисе
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              BikeRoute — это платформа для велосипедистов, которая помогает находить лучшие маршруты, 
              делиться опытом и открывать новые места для катания.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-2">
                <CountUp end={6} suffix="+" />
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Маршрутов</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-2">
                <CountUp end={500} suffix="+" />
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Километров</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-2">
                <CountUp end={2025} />
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Год основания</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-2">
                <CountUp end={100} suffix="%" />
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Бесплатно</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-section text-gray-900 mb-6">
                Наша миссия
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Мы верим, что велосипед — это не просто транспорт, а образ жизни. 
                Наша цель — сделать велосипедные прогулки доступными и безопасными для каждого.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                BikeRoute собирает лучшие маршруты Гродненской области, проверенные местными велосипедистами. 
                Каждый маршрут включает детальное описание, GPX-трек и важную информацию о сложности и достопримечательностях.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/"
                  className="px-8 py-4 bg-gray-900 text-white font-bold rounded-[12px] hover:bg-gray-800 transition-colors"
                >
                  Смотреть маршруты
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[24px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=800&fit=crop" 
                  alt="Велосипедист"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-blue-500 text-white p-8 rounded-[16px]">
                <div className="text-[32px] font-black">+6</div>
                <div className="text-sm font-semibold opacity-80">новых маршрутов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="heading-section text-gray-900 text-center mb-8 sm:mb-16">
            Почему BikeRoute?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-[16px] p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-[12px] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Проверенные маршруты</h3>
              <p className="text-gray-600">
                Каждый маршрут проверен местными велосипедистами. Мы гарантируем актуальность и безопасность треков.
              </p>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-[12px] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Детальная информация</h3>
              <p className="text-gray-600">
                Дистанция, время, перепад высот, достопримечательности — всё, что нужно для планирования поездки.
              </p>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-[12px] flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Сообщество</h3>
              <p className="text-gray-600">
                Оценивайте маршруты, оставляйте комментарии и помогайте другим велосипедистам выбрать лучший путь.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="heading-section uppercase tracking-tight mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Присоединяйтесь к сообществу велосипедистов и открывайте новые маршруты каждый день
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-[12px] hover:bg-gray-100 transition-colors"
            >
              Смотреть маршруты
            </Link>
            <Link 
              href="/safety"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-[12px] hover:bg-white/10 transition-colors"
            >
              Безопасность
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
