import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/shared/styles/globals.css'
import 'leaflet/dist/leaflet.css'
import { Header } from '@/widgets/Header'
import { NewRoutesNotifier } from '@/widgets/NewRoutesNotifier'
import { EmailUnsubFeedback } from '@/widgets/EmailUnsubFeedback'
import { AuthProvider } from '@/features/auth'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Эко-навигатор — планирование велосипедных маршрутов',
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
          <NewRoutesNotifier />
          <EmailUnsubFeedback />
          <main className="pt-24">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
