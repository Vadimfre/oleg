'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

import { API_URL } from '@/shared/config/env'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function RouteNotificationsSubscribe() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const subscribeEmail = async (e: FormEvent) => {
    e.preventDefault()
    setMsg(null)
    setBusy(true)
    try {
      const res = await fetch(`${API_URL}/notifications/email/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || `Ошибка ${res.status}`,
        )
      }
      setMsg(data?.message || 'Готово')
      setEmail('')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Ошибка')
    } finally {
      setBusy(false)
    }
  }

  const subscribePush = async () => {
    setMsg(null)
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setMsg('Браузер не поддерживает Web Push')
      return
    }
    setBusy(true)
    try {
      const vRes = await fetch(`${API_URL}/notifications/push/vapid-public`)
      const vJson = await vRes.json()
      if (!vJson?.publicKey) {
        setMsg('Push на сервере не настроен (VAPID ключи)')
        return
      }
      const reg = await navigator.serviceWorker.register('/sw.js')
      await reg.update()
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setMsg('Нужно разрешение на уведомления')
        return
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vJson.publicKey),
      })
      const json = sub.toJSON()
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        setMsg('Не удалось получить подписку')
        return
      }
      const res = await fetch(`${API_URL}/notifications/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || `Ошибка ${res.status}`)
      }
      setMsg('Браузерные уведомления включены')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Ошибка push')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Уведомления о новых маршрутах</h2>
      <p className="text-sm text-gray-600 mb-4">
        Подписка по email и push в браузере. Нужны SMTP и VAPID ключи в{' '}
        <code className="text-xs bg-gray-100 px-1 rounded">backend/.env</code>.
      </p>
      {msg && (
        <p className="mb-3 text-sm font-medium text-gray-800" role="status">
          {msg}
        </p>
      )}
      <form onSubmit={subscribeEmail} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Подписаться на email
        </button>
      </form>
      <button
        type="button"
        onClick={subscribePush}
        disabled={busy}
        className="w-full sm:w-auto rounded-lg border-2 border-gray-900 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
      >
        Включить push в этом браузере
      </button>
    </div>
  )
}
