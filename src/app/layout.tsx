import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { AuthCookieSync } from '@/components/shared/AuthCookieSync'

export const metadata: Metadata = {
  title: {
    default: 'AnalizadorFinanzas',
    template: '%s · AnalizadorFinanzas',
  },
  description: 'Tu plataforma de inteligencia financiera personal para Chile',
  applicationName: 'AnalizadorFinanzas',
  appleWebApp: {
    capable: true,
    title: 'AnalizadorFinanzas',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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
