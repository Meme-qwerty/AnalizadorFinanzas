'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTransactions } from '@/hooks/useTransactions'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { useCategories } from '@/hooks/useCategories'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function RecentTransactions() {
  const { data: transactions, isLoading, isError } = useTransactions()
  const { data: categories } = useCategories()
  const { maskAmount } = usePrivacyMode()

  const recent = transactions?.slice(0, 5) ?? []

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c.id === categoryId)?.name ?? categoryId
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Últimas transacciones</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          Error al cargar las transacciones
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Últimas transacciones</CardTitle>
        <Link href="/transactions" className="flex items-center gap-1 text-xs text-primary hover:underline">
          Ver todas <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Sin transacciones aún
          </p>
        ) : (
          <div className="space-y-1">
            {recent.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{tx.descriptionClean}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{formatDate(tx.occurredAt)}</span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                      {getCategoryName(tx.categoryId)}
                    </Badge>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums ml-3 shrink-0',
                    tx.type === 'income' ? 'text-income' : 'text-expense'
                  )}
                >
                  {tx.type === 'income' ? '+' : '-'}{maskAmount(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
