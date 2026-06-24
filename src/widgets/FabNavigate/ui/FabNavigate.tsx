'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function FabNavigate() {
  const pathname = usePathname()
  if (pathname === '/navigate') return null

  return (
    <Link
      href="/navigate"
      className="fixed bottom-6 right-6 z-[9990] group flex items-center gap-0 hover:gap-3 transition-all duration-300"
      aria-label="Открыть маршрут на карте"
    >
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-dark-900 text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-xl shadow-hard whitespace-nowrap">
        Поехали
      </span>
      <span className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-dark-900 shadow-glow btn-glow font-black text-xl">
        <span className="relative z-10">🧭</span>
        <span
          className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-30"
          aria-hidden
        />
      </span>
    </Link>
  )
}
