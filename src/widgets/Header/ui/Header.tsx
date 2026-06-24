'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth, LoginModal, RegisterModal } from '@/features/auth'
import { OPEN_LOGIN_MODAL_EVENT } from '@/shared/lib/open-login-modal'
import { useRoutes } from '@/features/routes'

const MOBILE_LINKS = [
  { href: '/routes', label: 'Все маршруты' },
  { href: '/weather', label: 'Погода' },
  { href: '/map', label: 'Карта' },
  { href: '/compare', label: 'Сравнение' },
  { href: '/navigate', label: 'Маршрут', accent: true },
  { href: '/history', label: 'История' },
  { href: '/stats', label: 'Аналитика' },
  { href: '/about', label: 'О нас' },
  { href: '/safety', label: 'Безопасность' },
  { href: '/admin', label: 'Админ' },
]

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { routes } = useRoutes()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const openLogin = () => setIsLoginOpen(true)
    window.addEventListener(OPEN_LOGIN_MODAL_EVENT, openLogin)
    return () => window.removeEventListener(OPEN_LOGIN_MODAL_EVENT, openLogin)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setShowUserMenu(false)
    setActiveMenu(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const navLink = (href: string, label: string, accent?: boolean) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href))
    return (
      <Link
        href={href}
        className={`px-4 py-2 text-[15px] rounded-lg transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
          accent
            ? 'bg-primary text-dark-900 font-bold hover:shadow-glow'
            : active
              ? 'bg-gray-100 text-gray-900 font-semibold'
              : 'text-gray-900 hover:bg-gray-50'
        }`}
      >
        {label}
      </Link>
    )
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9998] px-1.5 py-2.5 transition-all duration-300 overflow-visible ${
        scrolled ? 'pt-1.5' : ''
      }`}
    >
      <div
        className={`max-w-[1600px] mx-auto px-3 sm:px-8 rounded-xl transition-all duration-300 overflow-visible ${
          scrolled ? 'glass shadow-medium py-0' : 'bg-white shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-9 sm:h-9">
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M6 18L9 12L12 15L15 9L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 9L13 7L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="9" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg sm:text-[22px] font-bold text-gray-900 truncate">Эко-навигатор</span>
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 min-w-0 overflow-visible">
            <div
              className="relative"
              onMouseEnter={() => setActiveMenu('routes')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="px-4 py-2 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap">
                Маршруты
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {activeMenu === 'routes' && (
                <div className="absolute top-full left-0 pt-2 w-80 z-[9999]">
                  <div className="bg-white rounded-[12px] shadow-xl border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Все маршруты</p>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {routes.map((route) => (
                        <Link
                          key={route.id}
                          href={`/routes/${route.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="w-10 h-10 rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{route.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-xs text-gray-500">{route.distance} км</span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{route.duration} ч</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLink('/weather', 'Погода')}
            {navLink('/map', 'Карта')}
            {navLink('/compare', 'Сравнение')}
            {navLink('/navigate', 'Маршрут', true)}
            {navLink('/about', 'О нас')}
            {navLink('/safety', 'Безопасность')}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-full px-3 sm:px-4 py-2 transition-colors"
                >
                  <span className="text-sm sm:text-[15px] font-medium text-gray-900 max-w-[100px] sm:max-w-none truncate">
                    {user.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-[9999]">
                    <div className="bg-white rounded-[12px] shadow-lg border border-gray-100 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Профиль</p>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        Мой профиль
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-[8px] transition-colors"
                >
                  Войти
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-4 py-2 text-sm font-bold text-dark-900 bg-primary hover:bg-primary-400 rounded-[8px] transition-all btn-glow"
                >
                  Регистрация
                </button>
              </div>
            )}

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-900"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[4.5rem] z-[9997] bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {MOBILE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-[15px] font-semibold transition-colors ${
                    link.accent
                      ? 'bg-primary text-dark-900'
                      : pathname === link.href || pathname.startsWith(link.href + '/')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
              {isAuthenticated && user ? (
                <>
                  <div className="px-2">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link href="/profile" className="block w-full text-center py-3 rounded-xl bg-white border border-gray-200 font-semibold text-gray-900">
                    Профиль
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl text-red-600 font-semibold bg-white border border-red-100"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); setIsLoginOpen(true) }}
                    className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-900 bg-white"
                  >
                    Войти
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); setIsRegisterOpen(true) }}
                    className="w-full py-3 rounded-xl bg-primary text-dark-900 font-bold btn-glow"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </header>
  )
}
