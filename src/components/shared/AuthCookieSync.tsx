'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'

export function AuthCookieSync() {
  const { isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && token) {
      // Re-set cookie in case it expired but Zustand still has the session
      document.cookie = 'af_session=1; path=/; max-age=604800; SameSite=Lax'
    }
  }, [isAuthenticated, token])

  return null
}
