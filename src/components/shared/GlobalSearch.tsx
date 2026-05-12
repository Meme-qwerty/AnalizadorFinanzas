'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, ArrowLeftRight, Tag, Target, Wallet,
  BarChart3, FileText, Upload, Sliders, TrendingUp,
  Calendar, Bell, Settings, HeartPulse, Search, CreditCard,
} from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useTransactions } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { formatCLP } from '@/lib/formatters'

interface NavPage {
  href: string
  label: string
  icon: React.ElementType
  keywords?: string
}

const PAGES: NavPage[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight, keywords: 'pagos gastos ingresos' },
  { href: '/categories', label: 'Categorías', icon: Tag },
  { href: '/budgets', label: 'Presupuestos', icon: Target, keywords: 'limite gasto control' },
  { href: '/goals', label: 'Metas de ahorro', icon: TrendingUp, keywords: 'ahorro objetivo' },
  { href: '/accounts', label: 'Cuentas', icon: Wallet, keywords: 'banco tarjeta cuenta corriente' },
  { href: '/analytics', label: 'Analítica', icon: BarChart3, keywords: 'estadisticas graficos' },
  { href: '/reports', label: 'Reportes', icon: FileText, keywords: 'exportar csv' },
  { href: '/imports', label: 'Importar CSV', icon: Upload, keywords: 'cartola importar archivo' },
  { href: '/rules', label: 'Reglas automáticas', icon: Sliders, keywords: 'automatico categorizar' },
  { href: '/net-worth', label: 'Patrimonio neto', icon: TrendingUp, keywords: 'activos pasivos patrimonio' },
  { href: '/calendar', label: 'Calendario', icon: Calendar, keywords: 'dias semana mes' },
  { href: '/health', label: 'Salud financiera', icon: HeartPulse, keywords: 'score puntuacion salud' },
  { href: '/subscriptions', label: 'Suscripciones', icon: CreditCard, keywords: 'recurrente mensual' },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/settings', label: 'Configuración', icon: Settings, keywords: 'ajustes perfil' },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: transactions } = useTransactions({})
  const { data: accounts } = useAccounts()

  const toggle = useCallback(() => setOpen((o) => !o), [])
  useKeyboardShortcut('k', toggle, { modifiers: ['ctrl'] })

  const navigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/60 hover:bg-muted border border-border rounded-lg transition-colors"
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span>Ctrl</span><span>K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Búsqueda global">
        <CommandInput placeholder="Buscar páginas, transacciones, cuentas..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-4">
              <Search className="size-8 text-muted-foreground/30" />
              <p>Sin resultados</p>
            </div>
          </CommandEmpty>

          {/* Pages */}
          <CommandGroup heading="Páginas">
            {PAGES.map((page) => {
              const Icon = page.icon
              return (
                <CommandItem
                  key={page.href}
                  value={`${page.label} ${page.keywords ?? ''} ${page.href}`}
                  onSelect={() => navigate(page.href)}
                >
                  <Icon className="mr-2 size-4 text-muted-foreground" />
                  {page.label}
                  <CommandShortcut>{page.href}</CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>

          {accounts && accounts.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Cuentas">
                {accounts.map((acc) => (
                  <CommandItem
                    key={acc.id}
                    value={`cuenta ${acc.name} ${acc.type}`}
                    onSelect={() => navigate('/accounts')}
                  >
                    <Wallet className="mr-2 size-4 text-muted-foreground" />
                    {acc.name}
                    <CommandShortcut>{formatCLP(acc.balance)}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {transactions && transactions.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Transacciones recientes">
                {transactions.slice(0, 5).map((tx) => (
                  <CommandItem
                    key={tx.id}
                    value={`transaccion ${tx.description} ${tx.merchantName ?? ''}`}
                    onSelect={() => navigate('/transactions')}
                  >
                    <ArrowLeftRight className="mr-2 size-4 text-muted-foreground" />
                    <span className="truncate max-w-60">{tx.description}</span>
                    <CommandShortcut className={tx.type === 'income' ? 'text-income' : 'text-expense'}>
                      {tx.type === 'income' ? '+' : '-'}{formatCLP(tx.amount)}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
