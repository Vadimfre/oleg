'use client'

import { useEffect } from 'react'
import { showToast } from '@/shared/ui/Toast'

export function EmailUnsubFeedback() {
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const v = sp.get('email_unsub')
    if (v === '1') {
      showToast('Ты отписан от рассылки о новых маршрутах', 'info', 6000)
      window.history.replaceState({}, '', window.location.pathname)
    } else if (v === '0') {
      showToast('Ссылка отписки недействительна или уже использована', 'error', 6000)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])
  return null
}
