'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/features/auth'
import { useRoute } from '@/features/routes'
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '@/features/favorites'
import { RatingModal, rateRoute } from '@/features/ratings'
import { CommentsSection } from '@/features/comments'
import { showToast, showAuthRequiredToast } from '@/shared/ui/Toast'
import { WeatherCard } from '@/features/weather'
import {
  parseRouteCoordinates,
  resolveRouteGpxFile,
} from '@/shared/lib/route/resolveRouteTrack'

const StaticRouteMap = dynamic(
  () => import('@/widgets/StaticRouteMap').then((m) => m.StaticRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[320px] flex items-center justify-center bg-gray-50 text-gray-500 rounded-2xl">
        Загрузка карты…
      </div>
    ),
  },
)

interface RouteDetailPageProps {
  slug: string
}

export function RouteDetailPage({ slug }: RouteDetailPageProps) {
  const { isAuthenticated } = useAuth()
  const { route, isLoading, error } = useRoute(slug)
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const commentsRef = useRef<HTMLDivElement>(null)

  // Функция для получения разных изображений для каждого маршрута
  // Используем реальные изображения с сайта grodno.gov.by
  // Распределяем все 18 уникальных URL по маршрутам (по 3 на каждый)
  const getSliderImages = (routeSlug: string): string[] => {
    const imageSets: Record<string, string[]> = {
      'avgustovsci-kanal': [
        '/images/routes/avgustovsci-kanal.png',
        '/images/routes/avgustovsci-kanal/slide-1.png',
        '/images/routes/avgustovsci-kanal/slide-2.png',
        '/images/routes/avgustovsci-kanal/slide-3.png',
        '/images/routes/avgustovsci-kanal/slide-4.png',
      ],
      'pyshki': [
        '/images/routes/pyshki.png',
        '/images/routes/pyshki/slide-1.png',
        '/images/routes/pyshki/slide-2.png',
        '/images/routes/pyshki/slide-3.png',
      ],
      'grodno-losevo': [
        '/images/routes/grodno-losevo.png',
        '/images/routes/grodno-losevo/slide-1.png',
        '/images/routes/grodno-losevo/slide-2.png',
      ],
      'grodno-minsk': [
        '/images/routes/grodno-minsk.png',
        '/images/routes/grodno-minsk/slide-1.png',
        '/images/routes/grodno-minsk/slide-2.png',
      ],
      'dlinnyj-marshrut': [
        '/images/routes/dlinnyj-marshrut.png',
        '/images/routes/dlinnyj-marshrut/slide-1.png',
        '/images/routes/dlinnyj-marshrut/slide-2.png',
        '/images/routes/dlinnyj-marshrut/slide-3.png',
      ],
      'grodno-korobchitsy': [
        '/images/routes/grodno-korobchitsy.png',
        '/images/routes/grodno-korobchitsy/slide-1.png',
        '/images/routes/grodno-korobchitsy/slide-2.png',
        '/images/routes/grodno-korobchitsy/slide-3.png',
      ],
    }

    // Возвращаем набор для конкретного маршрута или дефолтный набор
    return imageSets[routeSlug] || [
      'http://grodno.gov.by/sm_full.aspx?guid=96693',
      'http://grodno.gov.by/sm_full.aspx?guid=96703',
      'http://grodno.gov.by/sm_full.aspx?guid=96713',
    ]
  }

  // Картинки для слайдера (разные для каждого маршрута)
  const sliderImages = route ? getSliderImages(route.slug) : []

  // Сброс слайдера при смене маршрута
  useEffect(() => {
    setCurrentSlide(0)
  }, [slug])

  // Автоматическая прокрутка каждые 3 секунды
  useEffect(() => {
    if (sliderImages.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [sliderImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  const promptAuth = (reason: 'favorite' | 'rating' | 'comment') => {
    showAuthRequiredToast(reason)
  }

  const requireAuth = (action: () => void, reason: 'favorite' | 'rating' | 'comment' = 'rating') => {
    if (!isAuthenticated) {
      promptAuth(reason)
      return
    }
    action()
  }

  // Проверяем, в избранном ли маршрут при загрузке
  useEffect(() => {
    if (isAuthenticated && route) {
      checkIsFavorite(slug).then(setIsFavorite)
    }
  }, [isAuthenticated, slug, route])

  // Обработчик оценки маршрута
  const handleRateRoute = async (rating: number, comment: string) => {
    if (!isAuthenticated) {
      promptAuth('rating')
      return
    }

    try {
      await rateRoute(slug, { rating, comment })
      showToast('Спасибо за вашу оценку! ⭐', 'success')
      setIsRatingModalOpen(false)
    } catch (error: any) {
      console.error('Rating error:', error.message)
      showToast(error.message || 'Ошибка при сохранении оценки', 'error')
      throw error
    }
  }

  // Toggle избранное
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      promptAuth('favorite')
      return
    }

    setIsLoadingFavorite(true)
    try {
      if (isFavorite) {
        await removeFromFavorites(slug)
        setIsFavorite(false)
        showToast('Маршрут удалён из избранного', 'info')
      } else {
        await addToFavorites(slug)
        setIsFavorite(true)
        showToast('Маршрут добавлен в избранное ❤️', 'success')
      }
    } catch (error: any) {
      console.error('Favorite error:', error.message)
      showToast(error.message || 'Ошибка при обновлении избранного', 'error')
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Загрузка маршрута...</p>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Маршрут не найден
          </h2>
          <p className="text-gray-600 mb-6">
            Такого маршрута не существует
          </p>
          <Link
            href="/"
            className="text-gray-900 font-semibold hover:underline"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    )
  }

  // Конвертируем часы в часы и минуты
  const hours = Math.floor(route.duration)
  const minutes = Math.round((route.duration - hours) * 60)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Навигация */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к маршрутам
        </Link>

        {/* Хедер с названием */}
        <div className="mb-8">
          <h1 className="heading-page text-gray-900 uppercase tracking-tight mb-3">
            {route.title}
          </h1>
          <p className="text-[15px] text-gray-600 max-w-2xl">
            {route.description}
          </p>
        </div>

        <div className="mb-4">
          <WeatherCard />
        </div>

        {/* Сетка: статистика */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Distance */}
          <div className="bg-white rounded-[12px] border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Дистанция</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-stat-lg text-gray-900">{route.distance}</span>
              <span className="text-2xl font-bold text-gray-500 mb-3">км</span>
            </div>
          </div>

          {/* Average Time */}
          <div className="bg-white rounded-[12px] border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Среднее время</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              {hours > 0 && (
                <div className="flex items-end gap-2">
                  <span className="text-stat-lg text-gray-900">{hours}</span>
                  <span className="text-2xl font-bold text-gray-500 mb-3">ч</span>
                </div>
              )}
              {minutes > 0 && (
                <div className="flex items-end gap-2">
                  <span className="text-stat-lg text-gray-900">{minutes}</span>
                  <span className="text-2xl font-bold text-gray-500 mb-3">м</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Среднее время прохождения маршрута
            </p>
          </div>

          {/* Elevation */}
          <div className="bg-white rounded-[12px] border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Перепад высот</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-stat-lg text-gray-900">{route.elevation}</span>
              <span className="text-2xl font-bold text-gray-500 mb-3">м</span>
            </div>
          </div>
        </div>

        {/* Вторая строка: Rating + Actions */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Rating Card */}
          <div className="bg-white rounded-[12px] border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Рейтинг</div>
                  <div className="flex items-center gap-3">
                    <span className="text-[48px] font-black text-gray-900 leading-none">4.8</span>
                    <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="h-16 w-px bg-gray-200" />
                <div>
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Сложность</div>
                  <div className="flex items-center gap-2">
                    {route.difficulty === 'easy' && (
                      <>
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="8"/>
                        </svg>
                        <span className="text-xl font-bold text-gray-900">Легкий</span>
                      </>
                    )}
                    {route.difficulty === 'medium' && (
                      <>
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="8"/>
                        </svg>
                        <span className="text-xl font-bold text-gray-900">Средний</span>
                      </>
                    )}
                    {route.difficulty === 'hard' && (
                      <>
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="10" r="8"/>
                        </svg>
                        <span className="text-xl font-bold text-gray-900">Сложный</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => requireAuth(() => setIsRatingModalOpen(true), 'rating')}
                className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-[8px] hover:bg-gray-800 transition-colors"
              >
                Оценить маршрут
              </button>
            </div>
          </div>
        </div>

        {/* Карта и действия */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Карта */}
          <div className="lg:col-span-2 bg-white rounded-[12px] border border-gray-100 overflow-hidden">
            <div className="map-panel min-h-[320px]">
              <StaticRouteMap
                gpxFile={resolveRouteGpxFile(route)}
                coordinates={parseRouteCoordinates(route.coordinates)}
              />
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-4">
            {/* Добавить в избранное */}
            <button
              onClick={handleToggleFavorite}
              disabled={isLoadingFavorite}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-[12px] border transition-all ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50'
              } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-bold">
                {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              </span>
            </button>

            {/* Карта маршрута */}
            <Link
              href={`/navigate?slug=${route.slug}`}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-dark-900 rounded-[12px] border border-primary-600 hover:bg-primary-400 transition-all font-bold"
            >
              <span className="text-xl">🧭</span>
              <span>Открыть маршрут</span>
            </Link>

            {/* Комментарии */}
            <button
              onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-[12px] border border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-bold">Комментарии</span>
            </button>

            {/* Основные точки маршрута */}
            <div className="bg-white rounded-[12px] border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Достопримечательности</h3>
              <ul className="space-y-3">
                {route.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* О маршруте с картинками */}
        <div className="bg-white rounded-[12px] border border-gray-100 p-8 mb-8">
          <h2 className="text-[28px] font-black text-gray-900 uppercase tracking-tight mb-6">
            О маршруте
          </h2>
          
          {/* Слайдер с картинками */}
          <div className="relative mb-8 rounded-[12px] overflow-hidden h-[min(50vh,280px)] sm:h-[400px]">
            {sliderImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`Слайд ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Стрелки */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Индикаторы */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
              {route.description}
            </p>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Этот маршрут предлагает отличное сочетание природы, истории и физической активности. 
              Подходит для велосипедистов с уровнем подготовки «{route.difficulty === 'easy' ? 'Легкий' : route.difficulty === 'medium' ? 'Средний' : 'Сложный'}». 
              Общая протяженность составляет {route.distance} км, а среднее время прохождения - около {hours > 0 ? `${hours} ч` : ''} {minutes > 0 ? `${minutes} мин` : ''}.
            </p>
          </div>
        </div>

        {/* Комментарии */}
        <div ref={commentsRef}>
          <CommentsSection
            routeId={slug}
            onCommentRequired={() => requireAuth(() => {}, 'comment')}
          />
        </div>
      </div>

      {/* Модальные окна */}
      {isRatingModalOpen && route && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleRateRoute}
          routeName={route.title}
        />
      )}

    </div>
  )
}
