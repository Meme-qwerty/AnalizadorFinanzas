'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolvedTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark)
      setResolvedTheme(dark ? 'dark' : 'light')
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const handler = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    } else {
      apply(theme === 'dark')
    }
  }, [theme, setResolvedTheme])

  return <>{children}</>
}
