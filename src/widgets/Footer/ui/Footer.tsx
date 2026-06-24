'use client'

import Link from 'next/link'

const links = [
  { href: '/map', label: 'Карта' },
  { href: '/weather', label: 'Погода' },
  { href: '/navigate', label: 'Маршрут' },
  { href: '/history', label: 'История' },
  { href: '/stats', label: 'Аналитика' },
  { href: '/compare', label: 'Сравнение' },
  { href: '/about', label: 'О нас' },
]

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/5 to-dark-900 pointer-events-none" />
      <div className="relative bg-dark-900 text-white">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="container mx-auto px-4 py-16 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-dark-900 font-black text-xl group-hover:shadow-glow transition-shadow">
                  🚴
                </div>
                <div>
                  <p className="text-2xl font-black uppercase tracking-tight">BikeRoute</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Гродно · веломаршруты</p>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Планируй, езди и отслеживай поездки. Карты маршрутов, погода для велосипедистов
                и аналитика — всё в одном месте.
              </p>
            </div>

            <div className="lg:col-span-4">
              <p className="section-label text-gray-500 mb-4">Навигация</p>
              <div className="grid grid-cols-2 gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm text-gray-300 hover:text-primary transition-colors py-1"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="section-label text-gray-500 mb-4">Старт</p>
              <Link
                href="/navigate"
                className="inline-flex items-center gap-2 bg-primary text-dark-900 font-bold px-5 py-3 rounded-xl btn-glow mb-4"
              >
                <span>Начать поездку</span>
                <span aria-hidden>→</span>
              </Link>
              <p className="text-xs text-gray-500">
                Демо: demo@bikeroutes.by
              </p>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} BikeRoutes · Гродно</span>
            <span className="text-primary/80 font-medium">Сделано для диплома с любовью к велоспорту</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
