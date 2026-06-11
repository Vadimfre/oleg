'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth, LoginModal, RegisterModal } from '@/features/auth'
import { useRoutes } from '@/features/routes'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { routes } = useRoutes()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

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
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[9998] p-2.5">
      <div className="bg-white rounded-xl shadow-sm max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* Bike Icon */}
            <div className="w-10 h-10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Переднее колесо */}
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                {/* Заднее колесо */}
                <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                {/* Рама */}
                <path d="M6 18L9 12L12 15L15 9L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Руль */}
                <path d="M15 9L13 7L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Седло */}
                <line x1="9" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[22px] font-bold text-gray-900">Эко-навигатор</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">


            <div 
              className="relative"
              onMouseEnter={() => setActiveMenu('routes')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className="px-4 py-2 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
              >
                Маршруты
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              {activeMenu === 'routes' && (
                <div 
                  className="absolute top-full left-0 pt-2 w-80 z-[9999]"
                >
                  <div 
                    className="bg-white rounded-[12px] shadow-xl border border-gray-100 py-2"
                  >
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
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs">
                              {route.difficulty === 'easy' && '🟢'}
                              {route.difficulty === 'medium' && '🟡'}
                              {route.difficulty === 'hard' && '🔴'}
                            </span>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-4 py-2 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
            >
              О нас
            </Link>

            <Link
              href="/safety"
              className="px-4 py-2 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
            >
              Безопасность
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Админ
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div 
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-full px-4 py-2 transition-colors"
                >
                  <span className="text-[15px] font-medium text-gray-900">{user.name}</span>
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
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="px-5 py-2 text-[15px] font-medium text-gray-900 hover:bg-gray-50 rounded-[8px] transition-colors"
                >
                  Войти
                </button>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-5 py-2 text-[15px] font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-[8px] transition-colors"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
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
