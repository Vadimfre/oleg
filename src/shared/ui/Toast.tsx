'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  const icon = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 z-[10000] flex items-center gap-3 ${bgColor} text-white px-4 py-3 rounded-[12px] shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {icon}
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300)
        }}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// Toast Manager
let toastId = 0
const toasts: Array<{ id: number; component: React.ReactElement }> = []

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
  const id = ++toastId

  // Создаем контейнер если его нет
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    document.body.appendChild(container)
  }

  // Создаем toast элемент
  const toastElement = document.createElement('div')
  toastElement.id = `toast-${id}`
  container.appendChild(toastElement)

  const removeToast = () => {
    toastElement.remove()
    if (container && container.children.length === 0) {
      container.remove()
    }
  }

  // Рендерим toast
  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(toastElement)
    root.render(<Toast message={message} type={type} duration={duration} onClose={removeToast} />)
  })
}