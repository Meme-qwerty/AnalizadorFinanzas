'use client'

import Link from 'next/link'
import { Bell, Eye, EyeOff, Menu, Moon, Sun } from 'lucide-react'
import { usePrivacyStore } from '@/store/privacy.store'
import { useNotificationsStore } from '@/store/notifications.store'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { GlobalSearch } from '@/components/shared/GlobalSearch'
import { QuickAddTransaction } from '@/components/shared/QuickAddTransaction'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { privacyMode, togglePrivacyMode } = usePrivacyStore()
  const { unreadCount } = useNotificationsStore()
  const { setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const { resolvedTheme, setTheme } = useThemeStore()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="h-16 flex items-center justify-between gap-3 px-4 border-b border-border bg-card shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>

      {/* Global search */}
      <div className="flex-1">
        <GlobalSearch />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Quick add */}
        <QuickAddTransaction />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Cambiar tema"
          title={resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {/* Privacy mode toggle */}
        <button
          onClick={togglePrivacyMode}
          className={cn(
            'p-2 rounded-md transition-colors',
            privacyMode
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          aria-label={privacyMode ? 'Desactivar modo privacidad' : 'Activar modo privacidad'}
          title={privacyMode ? 'Modo privacidad activo' : 'Modo privacidad'}
        >
          {privacyMode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
          )}
        </Link>

        {/* Avatar */}
        <Link
          href="/settings"
          className="ml-1 size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          {initials}
        </Link>
      </div>
    </header>
  )
}
