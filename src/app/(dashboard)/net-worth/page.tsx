'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccounts } from '@/hooks/useAccounts'
import { useNetWorthHistory } from '@/hooks/useAnalytics'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP } from '@/lib/formatters'
import { cn } from '@/lib/utils'

function CLPTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{formatCLP(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function NetWorthPage() {
  const { data: history, isLoading: loadingHistory } = useNetWorthHistory()
  const { data: accounts, isLoading: loadingAccounts } = useAccounts()
  const { maskAmount } = usePrivacyMode()

  const latest = history?.[history.length - 1]
  const previous = history?.[history.length - 2]
  const delta = latest && previous ? latest.netWorth - previous.netWorth : 0
  const deltaPct = previous?.netWorth ? (delta / previous.netWorth) * 100 : 0

  const assets = accounts?.filter((a) => a.balance > 0) ?? []
  const liabilities = accounts?.filter((a) => a.balance < 0) ?? []
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = Math.abs(liabilities.reduce((s, a) => s + a.balance, 0))
  const netWorth = totalAssets - totalLiabilities

  const TrendIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const trendColor = delta > 0 ? 'text-income' : delta < 0 ? 'text-expense' : 'text-muted-foreground'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Patrimonio neto</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Activos menos pasivos en tiempo real</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Patrimonio neto</p>
            <p className={cn('text-2xl font-bold mt-1 tabular-nums', netWorth >= 0 ? 'text-income' : 'text-expense')}>
              {maskAmount(netWorth)}
            </p>
            {delta !== 0 && (
              <div className={cn('flex items-center gap-1 text-xs mt-1.5', trendColor)}>
                <TrendIcon className="size-3" />
                <span>{delta > 0 ? '+' : ''}{maskAmount(delta)} vs mes anterior</span>
                <span>({deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%)</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total activos</p>
            <p className="text-2xl font-bold mt-1 text-income tabular-nums">{maskAmount(totalAssets)}</p>
            <p className="text-xs text-muted-foreground mt-1">{assets.length} cuenta{assets.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total pasivos</p>
            <p className="text-2xl font-bold mt-1 text-expense tabular-nums">{maskAmount(totalLiabilities)}</p>
            <p className="text-xs text-muted-foreground mt-1">{liabilities.length} cuenta{liabilities.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
      </div>

      {/* Net worth evolution chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Evolución del patrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <Skeleton className="h-60 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={history} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} className="fill-muted-foreground" width={56} />
                <Tooltip content={<CLPTooltip />} />
                <Area type="monotone" dataKey="netWorth" name="Patrimonio" stroke="#10B981" fill="url(#nwGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="assets" name="Activos" stroke="#3B82F6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="liabilities" name="Pasivos" stroke="#EF4444" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Assets / Liabilities breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-income">Activos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingAccounts ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : assets.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-6 text-center">Sin activos registrados</p>
            ) : (
              <div className="divide-y divide-border">
                {assets.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm">{a.name}</span>
                    <span className="text-sm font-semibold tabular-nums text-income">{maskAmount(a.balance)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-bold tabular-nums text-income">{maskAmount(totalAssets)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-expense">Pasivos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingAccounts ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : liabilities.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-6 text-center">Sin pasivos registrados</p>
            ) : (
              <div className="divide-y divide-border">
                {liabilities.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm">{a.name}</span>
                    <span className="text-sm font-semibold tabular-nums text-expense">{maskAmount(Math.abs(a.balance))}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/40">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-bold tabular-nums text-expense">{maskAmount(totalLiabilities)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
