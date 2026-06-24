import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/shared/styles/globals.css'
import 'leaflet/dist/leaflet.css'
import { Header } from '@/widgets/Header'
import { Footer } from '@/widgets/Footer'
import { FabNavigate } from '@/widgets/FabNavigate'
import { AuthProvider } from '@/features/auth'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'BikeRoutes - Планирование велосипедных маршрутов',
  description: 'Создавай, планируй и навигируй по велосипедным маршрутам',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="pt-24 min-h-screen">
            {children}
          </main>
          <Footer />
          <FabNavigate />
        </AuthProvider>
      </body>
    </html>
  )
}
