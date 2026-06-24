'use client'

import { useState, useEffect, useRef } from 'react'
import { RouteList } from '@/widgets/RouteList'
import Link from 'next/link'
import { FeaturedRouteSpotlight, HomeWeatherSection } from '@/features/home'
import { SectionReveal } from '@/shared/ui/SectionReveal'

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
      {/* Hero */}
      <div className="relative min-h-[560px] -mt-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/30 mesh-blob animate-float" />
        <div className="absolute bottom-10 right-[15%] w-96 h-96 rounded-full bg-blue-400/20 mesh-blob animate-float-delayed" />

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-16 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-xs font-bold uppercase tracking-[0.2em] text-dark-800">
                Гродно
              </span>
              <h1 className="text-[48px] sm:text-[64px] lg:text-[72px] font-black text-dark-900 leading-[0.95] uppercase tracking-tight mb-6">
                ВЕЛО
                <span className="text-primary">.</span>
                <br />
                МАРШРУТЫ
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-dark-900 via-dark-600 to-dark-900 animate-gradient">
                  БЕЗ СЮРПРИЗОВ
                </span>
              </h1>
              <p className="text-base md:text-lg text-dark-600 max-w-lg leading-relaxed mb-8">
                Карта маршрутов, погода для байкера, история поездок и аналитика — всё, чтобы
                просто сесть на велосипед и поехать.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('routes-section')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                  className="px-8 py-4 bg-dark-900 text-white font-bold uppercase tracking-tight rounded-xl hover:bg-dark-800 transition-colors shadow-hard"
                >
                  Маршруты
                </button>
                <Link
                  href="/navigate"
                  className="px-8 py-4 bg-primary text-dark-900 font-black uppercase tracking-tight rounded-xl btn-glow"
                >
                  Открыть маршрут
                </Link>
                <Link
                  href="/weather"
                  className="px-8 py-4 border-2 border-dark-900/15 font-bold uppercase tracking-tight rounded-xl hover:bg-white/80 transition-colors"
                >
                  Погода
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <SectionReveal delay={100}>
                <FeaturedRouteSpotlight />
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>

      <section id="about-service" className="container mx-auto px-4 mb-24">
        <SectionReveal>
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
        </SectionReveal>
      </section>

      <section id="safety-section" className="bg-gradient-to-b from-gray-50 to-white py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SectionReveal delay={0}>
              <div className="bg-white p-10 min-h-[400px] rounded-2xl flex flex-col justify-between card-hover border border-gray-100">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 uppercase leading-tight">
                      ПРОВЕРЕННЫЕ<br />МАРШРУТЫ
                    </h3>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-lg">✓</div>
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
              </SectionReveal>

              <SectionReveal delay={80}>
              <div className="bg-white p-10 min-h-[400px] rounded-2xl flex flex-col justify-between card-hover border border-gray-100">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 uppercase leading-tight">
                      ДЕТАЛЬНАЯ<br />ИНФОРМАЦИЯ
                    </h3>
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-lg text-white">📊</div>
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
              </SectionReveal>

              <SectionReveal delay={160}>
              <div className="bg-gray-900 p-10 min-h-[400px] rounded-2xl flex flex-col justify-between card-hover relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white uppercase leading-tight">
                      НАВИГАЦИЯ<br />БЕЗ ЗАБЛУЖДЕНИЙ
                    </h3>
                    <div className="w-10 h-10 bg-primary text-dark-900 rounded-xl flex items-center justify-center text-lg font-black">📍</div>
                  </div>
                  <div className="space-y-4 mb-auto">
                    <p className="text-base text-gray-300 leading-relaxed">
                      Подробный трек маршрута на всей дистанции.
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
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-16 max-w-[1400px]">
        <SectionReveal>
          <HomeWeatherSection />
        </SectionReveal>
      </section>

      <section id="routes-section" className="container mx-auto px-4 mb-24 scroll-mt-24">
        <SectionReveal>
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
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-1.5 shadow-soft">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-dark-900 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilter('easy')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'easy'
                        ? 'bg-dark-900 text-white shadow-sm'
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
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'medium'
                        ? 'bg-dark-900 text-white shadow-sm'
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
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      filter === 'hard'
                        ? 'bg-dark-900 text-white shadow-sm'
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
        </SectionReveal>
      </section>
    </div>
  )
}
