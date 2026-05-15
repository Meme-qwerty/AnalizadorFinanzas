'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardSummary } from '@/hooks/useAnalytics'
import { cn } from '@/lib/utils'

function ScoreArc({ score }: { score: number }) {
  const radius = 60
  const circumference = Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626'
  const label = score >= 70 ? 'Buena' : score >= 50 ? 'Regular' : 'Por mejorar'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" className="fill-foreground" fontSize="22" fontWeight="600">
          {score}
        </text>
      </svg>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

const scoreFactors: { key: string; description: string }[] = [
  { key: 'Tasa de ahorro', description: 'Porcentaje del ingreso que ahorras' },
  { key: 'Presupuestos', description: 'Cumplimiento de límites' },
  { key: 'Diversificación', description: 'Variedad de categorías de gasto' },
  { key: 'Metas', description: 'Progreso hacia tus objetivos' },
]

export default function FinancialHealthScore() {
  const { data, isLoading, isError } = useDashboardSummary()

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-44" /></CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="h-20 w-36 rounded-full" />
          <div className="w-full space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Salud financiera</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          Error al cargar los datos
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Score de salud financiera</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <ScoreArc score={data.healthScore} />
        <div className="w-full space-y-2">
          {scoreFactors.map((factor) => (
            <div key={factor.key} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{factor.key}</span>
              <span
                className={cn(
                  'font-medium',
                  data.healthScore >= 70 ? 'text-income' : data.healthScore >= 50 ? 'text-warning' : 'text-expense'
                )}
              >
                OK
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
