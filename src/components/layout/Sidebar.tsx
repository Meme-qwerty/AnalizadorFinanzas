'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Target,
  Wallet,
  BarChart3,
  FileText,
  Upload,
  Sliders,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  HeartPulse,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { href: '/categories', label: 'Categorías', icon: Tag },
  { href: '/budgets', label: 'Presupuestos', icon: Target },
  { href: '/goals', label: 'Metas', icon: TrendingUp },
  { href: '/accounts', label: 'Cuentas', icon: Wallet },
  { href: '/analytics', label: 'Analítica', icon: BarChart3 },
  { href: '/reports', label: 'Reportes', icon: FileText },
  { href: '/imports', label: 'Importar', icon: Upload },
  { href: '/rules', label: 'Reglas', icon: Sliders },
  { href: '/subscriptions', label: 'Suscripciones', icon: CreditCard },
  { href: '/net-worth', label: 'Patrimonio', icon: TrendingUp },
  { href: '/calendar', label: 'Calendario', icon: Calendar },
  { href: '/health', label: 'Salud financiera', icon: HeartPulse },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/settings', label: 'Configuración', icon: Settings },
]

function NavItem({ href, label, icon: Icon, collapsed, onClick }: {
  href: string; label: string; icon: React.ElementType; collapsed: boolean; onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        <Icon className="size-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    </li>
  )
}

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BarChart3 className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm whitespace-nowrap truncate">
              AnalizadorFinanzas
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </ul>
      </nav>
    </>
  )
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <motion.aside
        key="mobile-sidebar"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-full w-64 flex flex-col bg-card border-r border-border md:hidden"
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-4 p-1.5 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="size-4" />
        </button>
        <SidebarContent collapsed={false} onNavigate={() => setSidebarOpen(false)} />
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        key="desktop-sidebar"
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative hidden md:flex flex-col bg-card border-r border-border overflow-hidden"
      >
        <SidebarContent collapsed={!sidebarOpen} />

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 size-6 rounded-full bg-border border border-border flex items-center justify-center hover:bg-muted transition-colors z-10"
          aria-label={sidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          {sidebarOpen ? (
            <ChevronLeft className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>
      </motion.aside>
    </>
  )
}
