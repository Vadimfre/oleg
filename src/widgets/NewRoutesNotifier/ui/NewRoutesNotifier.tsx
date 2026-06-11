'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllRoutes, type RouteResponse } from '@/shared/api/routes.api'

const STORAGE_KEY = 'oleg_routes_last_seen_at'

export function NewRoutesNotifier() {
  const [items, setItems] = useState<RouteResponse[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const routes = await getAllRoutes()
        if (cancelled) return
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
          localStorage.setItem(STORAGE_KEY, new Date().toISOString())
          return
        }
        const since = new Date(raw)
        if (Number.isNaN(since.getTime())) {
          localStorage.setItem(STORAGE_KEY, new Date().toISOString())
          return
        }
        const fresh = routes.filter((r) => new Date(r.createdAt) > since)
        if (fresh.length > 0) setItems(fresh)
      } catch {
        /* ignore */
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    setItems(null)
  }

  if (!items?.length) return null

  return (
    <div className="fixed top-20 left-0 right-0 z-[9997] px-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-3xl w-full rounded-xl border border-amber-200 bg-amber-50 shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-900">
            Новые маршруты ({items.length})
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-amber-800">
            {items.map((r) => (
              <li key={r.id}>
                <Link href={`/routes/${r.slug}`} className="underline font-medium hover:text-amber-950">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg bg-amber-900 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-950"
        >
          Понятно
        </button>
      </div>
    </div>
  )
}
