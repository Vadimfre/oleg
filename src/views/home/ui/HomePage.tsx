'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { RouteList } from '@/widgets/RouteList'
import { Button } from '@/shared/ui'
import Link from 'next/link'

const MapView = dynamic(() => import('@/widgets/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500">
      Загрузка карты…
    </div>
  ),
})

// Компонент анимации подсчёта
function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          const startTime = Date.now()
          const startValue = 0

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
            const current = Math.floor(startValue + (end - startValue) * easeProgress)
            
            setCount(current)
            
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          
          animate()
        }
      },
      { threshold: 0.3 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={elementRef} className="text-[120px] font-black text-gray-900 uppercase leading-none tracking-tighter mb-4">
      {count}{suffix}
    </div>
  )
}

export function HomePage() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] -mt-24 mb-12 overflow-hidden bg-white">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4 mb-12">
            <h1 className="text-[64px] font-semibold text-dark-900 mb-6 leading-[72px] uppercase tracking-tight">
              ВЫБЕРИ СВОЙ МАРШРУТ<br />
              ДЛЯ ВЕЛОПРОГУЛКИ
            </h1>
            
            <p className="text-lg md:text-xl text-dark-600  leading-tight uppercase tracking-tight">
              МЫ БЕРЕЖНО СОБЕРЕМ МАРШРУТ И ОТПРАВИМ ВАМ В УДОБНОМ ДЛЯ<br />
              ВАС ВИДЕ, БУДЬ ТО КАРТА ИЛИ НАВИГАЦИЯ
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full max-w-[1440px] px-2.5">
            <button 
              onClick={() => {
                document.getElementById('routes-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }}
              className="w-full bg-dark-900 text-white py-3 rounded-[12px] text-lg font-medium hover:bg-dark-800 transition-colors uppercase tracking-tight shadow-lg cursor-pointer"
            >
              Выбрать маршрут
            </button>
          </div>
        </div>
      </div>

      {/* О нас - точь-в-точь как на скриншоте */}
      <section id="about-service" className="container mx-auto px-4 mb-24">
        <div className="max-w-[1400px] mx-auto">
          {/* Верхняя часть */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Левая часть - маленький текст */}
            <div className="lg:col-span-3">
              <p className="text-sm text-gray-400 uppercase tracking-wide">
                [велосипедные маршруты<br />как стиль жизни]
              </p>
            </div>

            {/* Правая часть - большой заголовок */}
            <div className="lg:col-span-9">
              <h2 className="text-[64px] lg:text-[80px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight mb-12">
                О НАШЕМ<br />СЕРВИСЕ
              </h2>

              {/* Два блока текста */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Левый блок */}
                <div className="space-y-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Мы являемся сервисом веломаршрутов для города Гродно. Реализуем маршруты 
                    большой командой энтузиастов, объединённых одной целью: создавать 
                    велопрогулки, которые работают на ваш активный образ жизни.
                  </p>
                </div>

                {/* Правый блок */}
                <div className="space-y-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Нам важно не количество, а гарантированное качество, 
                    безопасность каждого маршрута. Наша философия — это продукт, 
                    который учитывает каждую вашу потребность в велопрогулке.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть - большие цифры с анимацией */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-12 border-t border-gray-200">
            {/* 6+ маршрутов */}
            <div>
              <CountUp end={6} duration={2000} suffix="+" />
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                готовых веломаршрутов<br />
                по городу Гродно
              </p>
            </div>

            {/* 2025 год */}
            <div>
              <CountUp end={2025} duration={2500} />
              <p className="text-base text-gray-600 leading-relaxed max-w-md">
                год основания сервиса, с которого<br />
                мы выполняем свою миссию
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Фундамент уверенности - точь-в-точь как на скриншоте */}
      <section id="safety-section" className="bg-gray-50 py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              {/* Левая часть - маленький текст */}
              <div className="lg:col-span-3">
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  [безопасность и качество]
                </p>
              </div>

              {/* Правая часть - большой заголовок */}
              <div className="lg:col-span-9">
                <h2 className="text-[64px] lg:text-[80px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight mb-8">
                  ОСНОВА ВАШЕЙ<br />
                  БЕЗОПАСНОЙ<br />
                  ВЕЛОПРОГУЛКИ
                </h2>
                <p className="text-base text-gray-700 leading-relaxed max-w-xl">
                  Мы привыкли считать маршрут успешным только тогда, 
                  когда он полностью оправдывает ваши ожидания — 
                  как в плане безопасности, так и комфорта
                </p>
              </div>
            </div>

            {/* Три карточки внизу */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Карточка 1 - светлая */}
              <div className="bg-white p-10 min-h-[400px] rounded-[12px] flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 uppercase leading-tight">
                      ПРОВЕРЕННЫЕ<br />МАРШРУТЫ
                    </h3>
                    <div className="w-8 h-8 bg-gray-900 rounded-sm flex-shrink-0"></div>
                  </div>
                  <div className="space-y-4 mb-auto">
                    <p className="text-base text-gray-600 leading-relaxed">
                      Каждый маршрут тщательно проверен нашей командой. 
                      Мы учитываем качество покрытия и безопасность дороги
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Вы можете быть спокойными. Все маршруты регулярно обновляются и проверяются
                  </p>
                </div>
              </div>

              {/* Карточка 2 - светлая */}
              <div className="bg-white p-10 min-h-[400px] rounded-[12px] flex flex-col justify-between group hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 uppercase leading-tight">
                      ДЕТАЛЬНАЯ<br />ИНФОРМАЦИЯ
                    </h3>
                    <div className="w-8 h-8 bg-gray-900 rounded-sm flex-shrink-0"></div>
                  </div>
                  <div className="space-y-4 mb-auto">
                    <p className="text-base text-gray-600 leading-relaxed">
                      Находим оптимальные решения для вашей прогулки. 
                      Полное описание маршрута без скрытых сюрпризов
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Дистанция, время, сложность, покрытие — вся информация под рукой
                  </p>
                </div>
              </div>

              {/* Карточка 3 - черная */}
              <div className="bg-gray-900 p-10 min-h-[400px] rounded-[12px] flex flex-col justify-between group hover:bg-gray-800 transition-colors duration-300">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white uppercase leading-tight">
                      НАВИГАЦИЯ<br />БЕЗ ЗАБЛУЖДЕНИЙ
                    </h3>
                    <div className="w-8 h-8 bg-white rounded-sm flex-shrink-0"></div>
                  </div>
                  <div className="space-y-4 mb-auto">
                    <p className="text-base text-gray-300 leading-relaxed">
                      Точные GPS-треки на всём протяжении маршрута. 
                      Следуй по проложенному пути
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    Фиксируем маршрут на этапе проверки. Никаких неожиданностей на дороге
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Популярные маршруты - в стиле сайта */}
      <section id="routes-section" className="container mx-auto px-4 mb-24 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Левая часть - маленький текст */}
            <div className="lg:col-span-3">
              <p className="text-sm text-gray-400 uppercase tracking-wide">
                [готовые маршруты]
              </p>
            </div>

            {/* Правая часть - большой заголовок + фильтры */}
            <div className="lg:col-span-9">
              <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
                <h2 className="text-[48px] lg:text-[64px] font-black text-gray-900 uppercase leading-[0.95] tracking-tight">
                  ПОПУЛЯРНЫЕ<br />МАРШРУТЫ
                </h2>
                
                {/* Фильтры */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-[12px] p-1.5">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilter('easy')}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'easy'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8"/>
                    </svg>
                    Легкие
                  </button>
                  <button
                    onClick={() => setFilter('medium')}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'medium'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8"/>
                    </svg>
                    Средние
                  </button>
                  <button
                    onClick={() => setFilter('hard')}
                    className={`px-4 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'hard'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8"/>
                    </svg>
                    Сложные
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <RouteList filter={filter} />
        </div>
      </section>
    </div>
  )
}
