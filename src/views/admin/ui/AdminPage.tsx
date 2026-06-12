'use client'

import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { RoutePoint } from '@/widgets/RouteBuilderMap'
import { Card } from '@/shared/ui'
import {
  adminApi,
  type AdminComment,
  type AdminRating,
  type AdminRoute,
  type AdminStats,
  type AdminSubscriber,
  type AdminUser,
} from '@/shared/api/admin.api'

const RouteBuilderMap = dynamic(
  () => import('@/widgets/RouteBuilderMap').then((m) => m.RouteBuilderMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 rounded-3xl">
        Загрузка карты…
      </div>
    ),
  },
)

import { API_URL } from '@/shared/config/env'
const ADMIN_KEY_STORAGE = 'oleg_admin_api_key'

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900'

type Tab = 'create' | 'routes' | 'comments' | 'ratings' | 'users' | 'subscribers'

const TABS: { id: Tab; label: string }[] = [
  { id: 'create', label: 'Создать маршрут' },
  { id: 'routes', label: 'Маршруты' },
  { id: 'comments', label: 'Комментарии' },
  { id: 'ratings', label: 'Оценки' },
  { id: 'users', label: 'Пользователи' },
  { id: 'subscribers', label: 'Подписчики' },
]

const labelStyle: CSSProperties = { fontWeight: 600, fontSize: 13, marginBottom: 6 }

function fmtDate(value: string) {
  return new Date(value).toLocaleString('ru-RU')
}

function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[]
  children: ReactNode
  empty?: boolean
}) {
  if (empty) {
    return <p className="text-sm text-gray-500 py-6 text-center">Ничего не найдено</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            {headers.map((h) => (
              <th key={h} className="py-2 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('create')
  const [adminKey, setAdminKey] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string; slug?: string } | null>(
    null,
  )

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [routes, setRoutes] = useState<AdminRoute[]>([])
  const [comments, setComments] = useState<AdminComment[]>([])
  const [ratings, setRatings] = useState<AdminRating[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([])

  const [filterRouteId, setFilterRouteId] = useState('')

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [elevation, setElevation] = useState('')
  const [highlights, setHighlights] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [mapDistance, setMapDistance] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const s = sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (s) setAdminKey(s)
  }, [])

  useEffect(() => {
    if (!adminKey.trim()) return
    adminApi.getStats(adminKey).then(setStats).catch(() => undefined)
  }, [adminKey])

  const persistKey = useCallback(() => {
    if (adminKey.trim()) sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim())
  }, [adminKey])

  const requireKey = useCallback(() => {
    persistKey()
    if (!adminKey.trim()) {
      setMessage({ type: 'err', text: 'Укажите ключ (ADMIN_API_KEY на бэкенде)' })
      return false
    }
    return true
  }, [adminKey, persistKey])

  const loadTabData = useCallback(async () => {
    if (!adminKey.trim()) return
    setLoading(true)
    setMessage(null)
    try {
      persistKey()
      if (tab === 'routes' || tab === 'create') {
        const [s, r] = await Promise.all([adminApi.getStats(adminKey), adminApi.listRoutes(adminKey)])
        setStats(s)
        setRoutes(r)
      } else if (tab === 'comments') {
        setComments(await adminApi.listComments(adminKey, filterRouteId))
      } else if (tab === 'ratings') {
        setRatings(await adminApi.listRatings(adminKey, filterRouteId))
      } else if (tab === 'users') {
        setUsers(await adminApi.listUsers(adminKey))
      } else if (tab === 'subscribers') {
        setSubscribers(await adminApi.listSubscribers(adminKey))
      }
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Ошибка загрузки' })
    } finally {
      setLoading(false)
    }
  }, [adminKey, tab, filterRouteId, persistKey])

  useEffect(() => {
    if (tab === 'create') return
    void loadTabData()
  }, [tab, loadTabData])

  const handleRouteChange = (points: RoutePoint[], dist: number) => {
    setRoutePoints(points)
    setMapDistance(dist)
  }

  const handleCreateRoute = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!requireKey()) return
    if (routePoints.length < 2) {
      setMessage({ type: 'err', text: 'Отметьте минимум 2 точки на карте' })
      return
    }

    const fd = new FormData()
    fd.append('slug', slug.trim())
    fd.append('title', title.trim())
    fd.append('description', description.trim())
    fd.append('difficulty', difficulty)
    fd.append('distance', distance.trim())
    fd.append('duration', duration.trim())
    fd.append('elevation', elevation.trim())
    fd.append('highlights', highlights)
    fd.append('coordinates', JSON.stringify(routePoints.map((p) => [p.lat, p.lng])))
    if (imageUrl.trim()) fd.append('imageUrl', imageUrl.trim())
    if (coverFile) fd.append('cover', coverFile)

    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/admin/routes`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey.trim() },
        body: fd,
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = Array.isArray(body?.message)
          ? body.message.join(', ')
          : typeof body?.message === 'string'
            ? body.message
            : `Ошибка ${res.status}`
        throw new Error(msg)
      }
      setMessage({ type: 'ok', text: 'Маршрут создан.', slug: body.slug })
      setSlug('')
      setTitle('')
      setDescription('')
      setDistance('')
      setDuration('')
      setElevation('')
      setHighlights('')
      setImageUrl('')
      setCoverFile(null)
      setRoutePoints([])
      setMapDistance(0)
      const s = await adminApi.getStats(adminKey)
      setStats(s)
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Ошибка' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (label: string, action: () => Promise<{ message: string }>) => {
    if (!requireKey()) return
    if (!window.confirm(`Удалить ${label}?`)) return
    setMessage(null)
    try {
      const res = await action()
      setMessage({ type: 'ok', text: res.message })
      await loadTabData()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Ошибка' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl shadow-soft p-6">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← На главную
        </Link>
        <h1 className="mt-4 text-3xl font-black text-gray-900 tracking-tight">Админ-панель</h1>
        <p className="mt-2 text-[15px] text-gray-600">
          Управление маршрутами, комментариями, оценками и пользователями. Ключ{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">ADMIN_API_KEY</code> из{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">backend/.env</code>.
        </p>

        <div className="mt-4 max-w-md">
          <label style={labelStyle}>Ключ администратора</label>
          <input
            type="password"
            className={inputClass}
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            autoComplete="off"
            placeholder="ADMIN_API_KEY"
          />
        </div>

        {stats && (
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {[
              ['Маршруты', stats.routes],
              ['Комментарии', stats.comments],
              ['Оценки', stats.ratings],
              ['Пользователи', stats.users],
              ['Email', stats.subscribers],
            ].map(([label, count]) => (
              <span key={String(label)} className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                {label}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 text-sm ${
            message.type === 'ok'
              ? 'bg-green-50 text-green-900 border border-green-100'
              : 'bg-red-50 text-red-900 border border-red-100'
          }`}
        >
          <p>{message.text}</p>
          {message.type === 'ok' && message.slug && (
            <Link href={`/routes/${message.slug}`} className="mt-2 inline-block font-bold underline">
              Открыть маршрут →
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && tab !== 'create' && (
        <p className="text-sm text-gray-500">Загрузка…</p>
      )}

      {tab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card hover={false}>
              <form onSubmit={handleCreateRoute} className="flex flex-col gap-4">
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Название</label>
                  <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Описание</label>
                  <textarea
                    className={`${inputClass} min-h-[100px] resize-y`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label style={labelStyle}>Сложность</label>
                    <select
                      className={inputClass}
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                    >
                      <option value="easy">Лёгкий</option>
                      <option value="medium">Средний</option>
                      <option value="hard">Сложный</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>км</label>
                    <input type="number" step="0.1" className={inputClass} value={distance} onChange={(e) => setDistance(e.target.value)} required />
                  </div>
                  <div>
                    <label style={labelStyle}>ч</label>
                    <input type="number" step="0.1" className={inputClass} value={duration} onChange={(e) => setDuration(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Перепад (м)</label>
                  <input type="number" className={inputClass} value={elevation} onChange={(e) => setElevation(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Достопримечательности</label>
                  <textarea className={`${inputClass} min-h-[80px] resize-y`} value={highlights} onChange={(e) => setHighlights(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Обложка</label>
                  <input type="file" accept="image/*" className="text-sm" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
                </div>
                <div>
                  <label style={labelStyle}>URL картинки</label>
                  <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                <button type="submit" disabled={submitting} className="rounded-lg bg-gray-900 px-6 py-3 text-[15px] font-bold text-white hover:bg-gray-800 disabled:opacity-60">
                  {submitting ? 'Сохранение…' : 'Создать маршрут'}
                </button>
              </form>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[600px]">
              <RouteBuilderMap onRouteChange={handleRouteChange} />
            </div>
            <Card hover={false}>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">{mapDistance.toFixed(1)} км</div>
                  <div className="text-sm text-dark-600">На карте</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">{routePoints.length}</div>
                  <div className="text-sm text-dark-600">Точек</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'routes' && (
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Все маршруты</h2>
            <button type="button" onClick={() => void loadTabData()} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Обновить
            </button>
          </div>
          <AdminTable headers={['Название', 'Slug', 'Сложность', 'км', 'Создан', '']} empty={routes.length === 0}>
            {routes.map((r) => (
              <tr key={r.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{r.title}</td>
                <td className="py-3 pr-4 text-gray-600">{r.slug}</td>
                <td className="py-3 pr-4">{r.difficulty}</td>
                <td className="py-3 pr-4">{r.distance}</td>
                <td className="py-3 pr-4 text-gray-500">{fmtDate(r.createdAt)}</td>
                <td className="py-3">
                  <button
                    type="button"
                    className="text-red-600 text-sm font-semibold hover:underline"
                    onClick={() =>
                      void handleDelete(`маршрут «${r.title}»`, () =>
                        adminApi.deleteRoute(adminKey, r.slug),
                      )
                    }
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        </Card>
      )}

      {(tab === 'comments' || tab === 'ratings') && (
        <Card hover={false}>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              className={`${inputClass} max-w-xs`}
              placeholder="Фильтр по routeId (slug)"
              value={filterRouteId}
              onChange={(e) => setFilterRouteId(e.target.value)}
            />
            <button
              type="button"
              onClick={() => void loadTabData()}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white"
            >
              Применить
            </button>
          </div>

          {tab === 'comments' && (
            <AdminTable headers={['ID', 'Маршрут', 'Автор', 'Текст', 'Дата', '']} empty={comments.length === 0}>
              {comments.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 align-top">
                  <td className="py-3 pr-4">{c.id}</td>
                  <td className="py-3 pr-4">{c.routeId}</td>
                  <td className="py-3 pr-4">
                    <div>{c.user.name}</div>
                    <div className="text-xs text-gray-500">{c.user.email}</div>
                  </td>
                  <td className="py-3 pr-4 max-w-md">{c.text}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{fmtDate(c.createdAt)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-red-600 text-sm font-semibold hover:underline"
                      onClick={() =>
                        void handleDelete(`комментарий #${c.id}`, () =>
                          adminApi.deleteComment(adminKey, c.id),
                        )
                      }
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}

          {tab === 'ratings' && (
            <AdminTable headers={['ID', 'Маршрут', 'Автор', '★', 'Коммент', 'Дата', '']} empty={ratings.length === 0}>
              {ratings.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 align-top">
                  <td className="py-3 pr-4">{r.id}</td>
                  <td className="py-3 pr-4">{r.routeId}</td>
                  <td className="py-3 pr-4">
                    <div>{r.user.name}</div>
                    <div className="text-xs text-gray-500">{r.user.email}</div>
                  </td>
                  <td className="py-3 pr-4">{r.rating}</td>
                  <td className="py-3 pr-4 max-w-xs">{r.comment || '—'}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="text-red-600 text-sm font-semibold hover:underline"
                      onClick={() =>
                        void handleDelete(`оценку #${r.id}`, () =>
                          adminApi.deleteRating(adminKey, r.id),
                        )
                      }
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </Card>
      )}

      {tab === 'users' && (
        <Card hover={false}>
          <AdminTable headers={['ID', 'Имя', 'Email', 'Комменты', 'Оценки', 'Избранное', 'Регистрация', '']} empty={users.length === 0}>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="py-3 pr-4">{u.id}</td>
                <td className="py-3 pr-4">{u.name}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4">{u._count.comments}</td>
                <td className="py-3 pr-4">{u._count.ratings}</td>
                <td className="py-3 pr-4">{u._count.favorites}</td>
                <td className="py-3 pr-4 text-gray-500">{fmtDate(u.createdAt)}</td>
                <td className="py-3">
                  <button
                    type="button"
                    className="text-red-600 text-sm font-semibold hover:underline"
                    onClick={() =>
                      void handleDelete(`пользователя ${u.email}`, () =>
                        adminApi.deleteUser(adminKey, u.id),
                      )
                    }
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        </Card>
      )}

      {tab === 'subscribers' && (
        <Card hover={false}>
          <AdminTable headers={['ID', 'Email', 'Активен', 'Подписан', '']} empty={subscribers.length === 0}>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 pr-4">{s.id}</td>
                <td className="py-3 pr-4">{s.email}</td>
                <td className="py-3 pr-4">{s.active ? 'да' : 'нет'}</td>
                <td className="py-3 pr-4 text-gray-500">{fmtDate(s.createdAt)}</td>
                <td className="py-3">
                  <button
                    type="button"
                    className="text-red-600 text-sm font-semibold hover:underline"
                    onClick={() =>
                      void handleDelete(`подписчика ${s.email}`, () =>
                        adminApi.deleteSubscriber(adminKey, s.id),
                      )
                    }
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </AdminTable>
        </Card>
      )}
    </div>
  )
}
