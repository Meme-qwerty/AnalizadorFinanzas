'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategoryStats } from '@/hooks/useAnalytics'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatPercentage } from '@/lib/formatters'

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string; percentage: number } }> }) {
  const { maskAmount } = usePrivacyMode()
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-medium">{item.name}</p>
      <p className="text-muted-foreground">{maskAmount(item.value)}</p>
      <p className="text-muted-foreground">{formatPercentage(item.payload.percentage)}</p>
    </div>
  )
}

export default function SpendingChart() {
  const { data, isLoading, isError } = useCategoryStats()

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="size-52 rounded-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Gastos por categoría</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          Error al cargar los datos
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="amount"
              nameKey="categoryName"
            >
              {data.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.categoryColor} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
