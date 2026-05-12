'use client'

import { TrendingUp, TrendingDown, Minus, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useHealthScoreDetail } from '@/hooks/useAnalytics'
import { formatPercentage } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { HealthScoreDetail } from '@/types/analytics.types'

function scoreColor(v: number) {
  if (v >= 70) return 'text-income'
  if (v >= 50) return 'text-warning'
  return 'text-expense'
}

function progressColor(v: number) {
  if (v >= 70) return 'bg-income'
  if (v >= 50) return 'bg-warning'
  return 'bg-expense'
}

function StatusIcon({ value }: { value: number }) {
  if (value >= 70) return <CheckCircle2 className="size-4 text-income shrink-0" />
  if (value >= 50) return <AlertCircle className="size-4 text-warning shrink-0" />
  return <XCircle className="size-4 text-expense shrink-0" />
}

const FACTOR_TIPS: Record<string, { label: string; tip: string; unit?: string }> = {
  savingsRate: {
    label: 'Tasa de ahorro',
    tip: 'Porcentaje del ingreso que estás ahorrando. Se recomienda al menos un 20%.',
    unit: '%',
  },
  budgetCompliance: {
    label: 'Cumplimiento de presupuestos',
    tip: 'Qué tan bien estás respetando los límites que estableciste.',
    unit: '%',
  },
  expenseDiversification: {
    label: 'Diversificación de gastos',
    tip: 'Un gasto muy concentrado en pocas categorías indica mayor riesgo.',
    unit: '%',
  },
  incomeRegularity: {
    label: 'Regularidad de ingresos',
    tip: 'Ingresos estables mes a mes mejoran tu predictibilidad financiera.',
    unit: '%',
  },
  goalProgress: {
    label: 'Progreso en metas',
    tip: 'Avance hacia tus metas de ahorro activas.',
    unit: '%',
  },
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 80
  const circumference = Math.PI * radius
  const progress = (score / 100) * circumference
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626'
  const label = score >= 70 ? 'Buena' : score >= 50 ? 'Regular' : 'Por mejorar'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="180" height="105" viewBox="0 0 180 105">
        <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="90" y="82" textAnchor="middle" className="fill-foreground" fontSize="30" fontWeight="700">{score}</text>
        <text x="90" y="96" textAnchor="middle" className="fill-muted-foreground" fontSize="12">{label}</text>
      </svg>
    </div>
  )
}

function FactorBreakdown({ detail }: { detail: HealthScoreDetail }) {
  const factors = [
    { key: 'savingsRate', value: detail.savingsRate },
    { key: 'budgetCompliance', value: detail.budgetCompliance },
    { key: 'expenseDiversification', value: detail.expenseDiversification },
    { key: 'incomeRegularity', value: detail.incomeRegularity },
    { key: 'goalProgress', value: detail.goalProgress },
  ]

  return (
    <div className="space-y-4">
      {factors.map(({ key, value }) => {
        const meta = FACTOR_TIPS[key]
        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusIcon value={value} />
                <span className="text-sm font-medium">{meta.label}</span>
              </div>
              <span className={cn('text-sm font-bold tabular-nums', scoreColor(value))}>
                {formatPercentage(value)}
              </span>
            </div>
            <Progress value={value} indicatorClassName={progressColor(value)} />
            <p className="text-xs text-muted-foreground">{meta.tip}</p>
          </div>
        )
      })}
    </div>
  )
}

export default function HealthPage() {
  const { data: detail, isLoading } = useHealthScoreDetail()

  const radarData = detail ? [
    { subject: 'Ahorro', value: detail.savingsRate },
    { subject: 'Presupuestos', value: detail.budgetCompliance },
    { subject: 'Diversif.', value: detail.expenseDiversification },
    { subject: 'Ingresos', value: detail.incomeRegularity },
    { subject: 'Metas', value: detail.goalProgress },
  ] : []

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-2xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }

  if (!detail) return null

  const TrendIcon = detail.trend === 'up' ? TrendingUp : detail.trend === 'down' ? TrendingDown : Minus
  const trendColor = detail.trend === 'up' ? 'text-income' : detail.trend === 'down' ? 'text-expense' : 'text-muted-foreground'
  const scoreDiff = detail.score - detail.previousScore

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Score de salud financiera</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Análisis detallado de tus finanzas</p>
      </div>

      {/* Score card */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <ScoreGauge score={detail.score} />
          <div className="flex items-center gap-2">
            <TrendIcon className={cn('size-4', trendColor)} />
            <span className={cn('text-sm font-medium', trendColor)}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff} puntos vs mes anterior
            </span>
          </div>
          {detail.hasEmergencyFund && (
            <Badge className="bg-income/10 text-income border-0">
              <CheckCircle2 className="size-3 mr-1" /> Fondo de emergencia activo
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Radar + breakdown */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Radar financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <Radar name="Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Tooltip formatter={(v) => (typeof v === 'number' ? `${v.toFixed(0)}%` : '')} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Desglose por factor</CardTitle>
          </CardHeader>
          <CardContent>
            <FactorBreakdown detail={detail} />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.goalProgress < 50 && (
            <div className="flex gap-3 p-3 rounded-lg bg-warning/10 text-sm">
              <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Avanza en tus metas</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tu progreso en metas está por debajo del 50%. Considera aumentar tus aportes mensuales.</p>
              </div>
            </div>
          )}
          {detail.savingsRate >= 50 && (
            <div className="flex gap-3 p-3 rounded-lg bg-income/10 text-sm">
              <CheckCircle2 className="size-4 text-income shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Excelente tasa de ahorro</p>
                <p className="text-xs text-muted-foreground mt-0.5">Estás ahorrando más del 50% de tus ingresos. ¡Sigue así!</p>
              </div>
            </div>
          )}
          {detail.budgetCompliance >= 80 && (
            <div className="flex gap-3 p-3 rounded-lg bg-income/10 text-sm">
              <CheckCircle2 className="size-4 text-income shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Presupuestos bajo control</p>
                <p className="text-xs text-muted-foreground mt-0.5">Estás respetando bien tus límites de gasto. Mantén el hábito.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
