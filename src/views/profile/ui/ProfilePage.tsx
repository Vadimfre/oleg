'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth'
import { updateProfile } from '@/features/auth/model/auth.api'
import { getFavorites } from '@/features/favorites'
import { getUserComments, Comment } from '@/features/comments'
import { getUserRatings } from '@/features/ratings/model/user-ratings.api'
import { getAllRoutes, RouteResponse } from '@/shared/api/routes.api'
import { RouteCard } from '@/entities/route'
import Link from 'next/link'

interface UserRating {
  id: number
  routeId: string
  rating: number
  comment?: string
  createdAt: string
}

export function ProfilePage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()
  const [allRoutes, setAllRoutes] = useState<RouteResponse[]>([])
  const [favoriteRouteIds, setFavoriteRouteIds] = useState<string[]>([])
  const [userComments, setUserComments] = useState<Comment[]>([])
  const [userRatings, setUserRatings] = useState<UserRating[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)
  const [loadingRatings, setLoadingRatings] = useState(true)
  
  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (user) {
      setEditName(user.name)
      setEditEmail(user.email)
    }
  }, [user])

  useEffect(() => {
    // Загружаем все маршруты
    getAllRoutes()
      .then(setAllRoutes)
      .catch((error) => console.error('Error loading routes:', error))
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Загружаем избранное
      getFavorites()
        .then(setFavoriteRouteIds)
        .catch((error) => console.error('Error loading favorites:', error))
        .finally(() => setLoadingFavorites(false))

      // Загружаем комментарии
      getUserComments()
        .then(setUserComments)
        .catch((error) => console.error('Error loading comments:', error))
        .finally(() => setLoadingComments(false))

      // Загружаем рейтинги
      getUserRatings()
        .then(setUserRatings)
        .catch((error) => console.error('Error loading ratings:', error))
        .finally(() => setLoadingRatings(false))
    } else {
      setLoadingFavorites(false)
      setLoadingComments(false)
      setLoadingRatings(false)
    }
  }, [isAuthenticated])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  const getRouteName = (routeId: string) => {
    const route = allRoutes.find(r => r.slug === routeId)
    return route?.title || routeId
  }

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setSaveError('Имя не может быть пустым')
      return
    }

    setIsSaving(true)
    setSaveError('')

    try {
      await updateProfile({ name: editName, email: editEmail })
      if (refreshUser) {
        await refreshUser()
      }
      setIsEditing(false)
    } catch (error: any) {
      setSaveError(error.message || 'Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      setEditName(user.name)
      setEditEmail(user.email)
    }
    setIsEditing(false)
    setSaveError('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Вход необходим
          </h2>
          <p className="text-gray-600 mb-6">
            Войдите в аккаунт, чтобы увидеть свой профиль
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    )
  }

  const favoriteRoutes = allRoutes.filter((route) =>
    favoriteRouteIds.includes(route.slug)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Профиль пользователя */}
        <div className="bg-white rounded-[12px] border border-gray-100 p-8 mb-8">
          {isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-3xl">
                  {editName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Редактирование профиля</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Имя</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] focus:outline-none focus:border-gray-900 transition-colors"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] focus:outline-none focus:border-gray-900 transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                    {saveError && (
                      <p className="text-red-500 text-sm">{saveError}</p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-3 bg-gray-900 text-white font-bold rounded-[8px] hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-[8px] hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-3xl">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-[32px] font-black text-gray-900 uppercase tracking-tight mb-1">
                  {user?.name}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-[8px] hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Редактировать
                </button>
                <div className="text-right">
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                    Избранных
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {favoriteRouteIds.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Избранные маршруты */}
        <div className="mb-6">
          <h2 className="text-[28px] font-black text-gray-900 uppercase tracking-tight mb-6">
            Избранные маршруты
          </h2>

          {loadingFavorites ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Загрузка избранного...</p>
            </div>
          ) : favoriteRoutes.length === 0 ? (
            <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Нет избранных маршрутов
              </h3>
              <p className="text-gray-600 mb-6">
                Добавляйте понравившиеся маршруты в избранное
              </p>
              <Link
                href="/"
                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-[12px] font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Посмотреть маршруты
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRoutes.map((route) => (
                <RouteCard key={route.id} route={route} onClick={() => window.location.href = `/routes/${route.slug}`} />
              ))}
            </div>
          )}
        </div>

        {/* Мои комментарии */}
        <div className="mb-8">
          <h2 className="text-[28px] font-black text-gray-900 uppercase tracking-tight mb-6">
            Мои комментарии ({userComments.length})
          </h2>

          {loadingComments ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Загрузка комментариев...</p>
            </div>
          ) : userComments.length === 0 ? (
            <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Нет комментариев
              </h3>
              <p className="text-gray-600">
                Вы еще не оставили ни одного комментария
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userComments.map((comment: any) => (
                <div key={comment.id} className="bg-white rounded-[12px] border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/routes/${comment.routeId}`} className="text-lg font-bold text-gray-900 hover:text-blue-500 transition-colors">
                        {getRouteName(comment.routeId)}
                      </Link>
                      <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Мои рейтинги */}
        <div className="mb-8">
          <h2 className="text-[28px] font-black text-gray-900 uppercase tracking-tight mb-6">
            Мои оценки ({userRatings.length})
          </h2>

          {loadingRatings ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Загрузка оценок...</p>
            </div>
          ) : userRatings.length === 0 ? (
            <div className="bg-white rounded-[12px] border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Нет оценок
              </h3>
              <p className="text-gray-600">
                Вы еще не оценили ни одного маршрута
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRatings.map((rating) => (
                <div key={rating.id} className="bg-white rounded-[12px] border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link href={`/routes/${rating.routeId}`} className="text-lg font-bold text-gray-900 hover:text-blue-500 transition-colors">
                        {getRouteName(rating.routeId)}
                      </Link>
                      <p className="text-xs text-gray-500">{formatDate(rating.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700 text-sm">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-[12px] border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Комментариев</span>
            </div>
            <div className="text-[48px] font-black text-gray-900 leading-none">{userComments.length}</div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Оценок</span>
            </div>
            <div className="text-[48px] font-black text-gray-900 leading-none">{userRatings.length}</div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Избранных</span>
            </div>
            <div className="text-[48px] font-black text-gray-900 leading-none">{favoriteRouteIds.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
