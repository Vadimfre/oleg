'use client'

import Link from 'next/link'

export function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 border border-white/20 rounded-full" />
        </div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-[64px] font-black uppercase tracking-tight leading-none mb-6">
              Безопасность<br />и качество
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Ваша безопасность — наш главный приоритет. Все маршруты проверены и содержат актуальную информацию.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Rules Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-[42px] font-black text-gray-900 uppercase tracking-tight text-center mb-16">
            Правила безопасности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-green-600">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Носите шлем</h3>
                  <p className="text-gray-600">
                    Шлем снижает риск серьёзных травм головы на 85%. Всегда надевайте шлем перед поездкой, 
                    даже на коротких маршрутах.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Проверяйте велосипед</h3>
                  <p className="text-gray-600">
                    Перед каждой поездкой проверяйте тормоза, давление в шинах и работу переключателей. 
                    Это займёт 2 минуты, но может спасти жизнь.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-yellow-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-yellow-600">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Используйте фары</h3>
                  <p className="text-gray-600">
                    В тёмное время суток обязательно используйте передний белый и задний красный фонарь. 
                    Светоотражатели — дополнительная защита.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-purple-600">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Берите воду</h3>
                  <p className="text-gray-600">
                    Обезвоживание снижает концентрацию и реакцию. Берите минимум 0.5л воды на каждые 15 км маршрута.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-red-600">5</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Соблюдайте ПДД</h3>
                  <p className="text-gray-600">
                    Велосипедист — участник дорожного движения. Соблюдайте правила, подавайте сигналы при поворотах.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-[16px] p-8 border-l-4 border-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-orange-600">6</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Сообщайте о планах</h3>
                  <p className="text-gray-600">
                    Расскажите кому-то о маршруте и времени возвращения. Возьмите телефон с полным зарядом.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop" 
                  alt="Качество маршрутов"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-green-500 text-white p-6 rounded-[16px]">
                <div className="text-[28px] font-black">100%</div>
                <div className="text-sm font-semibold opacity-80">проверено</div>
              </div>
            </div>
            <div>
              <h2 className="text-[42px] font-black text-gray-900 uppercase tracking-tight mb-6">
                Качество маршрутов
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Каждый маршрут в нашей базе проходит многоуровневую проверку качества перед публикацией.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700"><strong>Физическая проверка</strong> — каждый маршрут проехан нашей командой</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700"><strong>Интерактивная карта</strong> — маршрут на карте с точками старта и финиша</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700"><strong>Оценка сложности</strong> — объективный расчёт на основе рельефа</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700"><strong>Регулярное обновление</strong> — информация актуализируется ежесезонно</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[42px] font-black text-gray-900 uppercase tracking-tight mb-4">
              Экстренные контакты
            </h2>
            <p className="text-lg text-gray-600">
              Сохраните эти номера в телефоне перед поездкой
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[16px] p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-[32px] font-black text-red-600 mb-2">112</div>
              <p className="text-gray-600 font-semibold">Экстренная помощь</p>
              <p className="text-sm text-gray-500">Единый номер спасения</p>
            </div>
            <div className="bg-white rounded-[16px] p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-[32px] font-black text-blue-600 mb-2">102</div>
              <p className="text-gray-600 font-semibold">Милиция</p>
              <p className="text-sm text-gray-500">При ДТП или происшествиях</p>
            </div>
            <div className="bg-white rounded-[16px] p-8 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-[32px] font-black text-green-600 mb-2">103</div>
              <p className="text-gray-600 font-semibold">Скорая помощь</p>
              <p className="text-sm text-gray-500">Медицинская помощь</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-[42px] font-black uppercase tracking-tight mb-6">
            Безопасной дороги!
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Соблюдайте правила безопасности и наслаждайтесь поездкой
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/"
              className="px-8 py-4 bg-green-500 text-white font-bold rounded-[12px] hover:bg-green-600 transition-colors"
            >
              Выбрать маршрут
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-[12px] hover:bg-white/10 transition-colors"
            >
              О нас
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
