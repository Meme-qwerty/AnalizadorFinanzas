import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { AuthCookieSync } from '@/components/shared/AuthCookieSync'

export const metadata: Metadata = {
  title: 'AnalizadorFinanzas',
  description: 'Tu plataforma de inteligencia financiera personal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ThemeProvider>
            <AuthCookieSync />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}