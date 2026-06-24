'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { openLoginModal } from '@/shared/lib/open-login-modal'

export type ToastType = 'success' | 'error' | 'info' | 'auth'

interface ToastProps {
  message: string
  type: ToastType
  title?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  duration?: number
  onClose?: () => void
}

const styles: Record<ToastType, { shell: string; icon: React.ReactNode }> = {
  success: {
    shell: 'bg-white border-emerald-200 shadow-[0_12px_40px_rgba(16,185,129,0.18)]',
    icon: (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
        ✓
      </span>
    ),
  },
  error: {
    shell: 'bg-white border-red-200 shadow-[0_12px_40px_rgba(239,68,68,0.16)]',
    icon: (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 font-bold">
        !
      </span>
    ),
  },
  info: {
    shell: 'bg-white border-blue-200 shadow-[0_12px_40px_rgba(59,130,246,0.14)]',
    icon: (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
        i
      </span>
    ),
  },
  auth: {
    shell: 'bg-dark-900 border-primary/40 shadow-[0_16px_48px_rgba(0,0,0,0.28)]',
    icon: (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-lg">
        🔒
      </span>
    ),
  },
}

export function Toast({
  message,
  type,
  title,
  actionLabel,
  actionHref,
  onAction,
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const style = styles[type]
  const isAuth = type === 'auth'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const close = () => {
    setIsVisible(false)
    if (onClose) setTimeout(onClose, 300)
  }

  const actionButton =
    actionLabel &&
    (actionHref ? (
      <Link
        href={actionHref}
        onClick={close}
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
          isAuth
            ? 'bg-primary text-dark-900 hover:bg-primary-400'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {actionLabel}
        <span aria-hidden>→</span>
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => {
          onAction?.()
          close()
        }}
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
          isAuth
            ? 'bg-primary text-dark-900 hover:bg-primary-400'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {actionLabel}
        <span aria-hidden>→</span>
      </button>
    ))

  return (
    <div
      className={`pointer-events-auto w-[min(92vw,420px)] rounded-2xl border px-4 py-4 transition-all duration-300 toast-enter ${
        style.shell
      } ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="min-w-0 flex-1">
          {title && (
            <p className={`text-sm font-black leading-snug ${isAuth ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </p>
          )}
          <p
            className={`text-sm leading-relaxed ${title ? 'mt-1' : ''} ${
              isAuth ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {message}
          </p>
          {actionButton && <div className="mt-3">{actionButton}</div>}
        </div>
        <button
          type="button"
          onClick={close}
          className={`shrink-0 rounded-lg p-1.5 transition-colors ${
            isAuth
              ? 'text-gray-400 hover:bg-white/10 hover:text-white'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
          }`}
          aria-label="Закрыть"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

type ToastOptions = {
  title?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  duration?: number
}

function mountToast(props: ToastProps) {
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.className =
      'fixed bottom-6 left-4 z-[10000] flex w-full max-w-[420px] flex-col items-start gap-3 pointer-events-none'
    document.body.appendChild(container)
  }

  const toastElement = document.createElement('div')
  container.appendChild(toastElement)

  const removeToast = () => {
    toastElement.remove()
    if (container && container.children.length === 0) {
      container.remove()
    }
  }

  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(toastElement)
    root.render(<Toast {...props} onClose={removeToast} />)
  })
}

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration = 4000,
  options?: Omit<ToastOptions, 'duration'>,
) {
  mountToast({ message, type, duration, ...options })
}

const authCopy = {
  favorite: {
    title: 'Нужен аккаунт',
    message: 'Войдите, чтобы добавлять маршруты в избранное и быстро находить их в профиле.',
  },
  rating: {
    title: 'Оценка доступна после входа',
    message: 'Авторизуйтесь, чтобы поставить оценку и помочь другим велосипедистам с выбором.',
  },
  comment: {
    title: 'Комментарии для пользователей',
    message: 'Войдите в аккаунт, чтобы оставлять комментарии к маршрутам.',
  },
} as const

export type AuthToastReason = keyof typeof authCopy

export function showAuthRequiredToast(reason: AuthToastReason) {
  const copy = authCopy[reason]

  mountToast({
    type: 'auth',
    title: copy.title,
    message: copy.message,
    actionLabel: 'Войти',
    onAction: openLoginModal,
    duration: 5500,
  })
}
