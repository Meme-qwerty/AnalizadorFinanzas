'use client'

import { useState, useMemo } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { formatCLP } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types/goal.types'

interface Props {
  goals: Goal[]
  currentMonthlySavings?: number
}

const STEP = 10_000
const MIN  = 10_000
const DEFAULT_AMOUNT = 200_000

function monthsToReach(remaining: number, monthly: number): number {
  if (monthly <= 0 || remaining <= 0) return 0
  return Math.ceil(remaining / monthly)
}

function targetDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
}

function yearsMonths(months: number): string {
  if (months <= 0) return '¡Ya lo lograste!'
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} ${m === 1 ? 'mes' : 'meses'}`
  if (m === 0) return `${y} ${y === 1 ? 'año' : 'años'}`
  return `${y} ${y === 1 ? 'año' : 'años'} y ${m} ${m === 1 ? 'mes' : 'meses'}`
}

export function GoalSimulator({ goals, currentMonthlySavings = 712_500 }: Props) {
  const { maskAmount } = usePrivacyMode()

  const [selectedId, setSelectedId] = useState<string>(goals[0]?.id ?? '')
  const [monthly, setMonthly] = useState(DEFAULT_AMOUNT)

  const goal = useMemo(() => goals.find((g) => g.id === selectedId), [goals, selectedId])

  const remaining   = goal ? Math.max(goal.targetAmount - goal.currentAmount, 0) : 0
  const currentPct  = goal ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
  const sliderMax   = Math.max(Math.min(remaining, 5_000_000), MIN * 10)

  const simMonths     = monthsToReach(remaining, monthly)
  const currentMonths = monthsToReach(remaining, currentMonthlySavings)
  const saved         = currentMonths - simMonths
  const isFaster      = saved > 0
  const isAlreadyDone = remaining <= 0

  if (goals.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="size-4 text-muted-foreground" />
          Simulador de meta
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Goal selector */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Meta a simular</p>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goals.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.icon} {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {goal && (
          <>
            {/* Current progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progreso actual</span>
                <span className="tabular-nums font-medium">
                  {maskAmount(goal.currentAmount)} / {maskAmount(goal.targetAmount)}
                </span>
              </div>
              <Progress value={currentPct} className="h-2" indicatorClassName="bg-primary" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{currentPct.toFixed(0)}% completado</span>
                {!isAlreadyDone && (
                  <span className="text-muted-foreground tabular-nums">
                    Faltan {maskAmount(remaining)}
                  </span>
                )}
              </div>
            </div>

            {isAlreadyDone ? (
              <div className="flex items-center justify-center gap-2 py-4 rounded-xl bg-income/10 text-income">
                <span className="text-lg">🎉</span>
                <p className="text-sm font-semibold">¡Meta alcanzada!</p>
              </div>
            ) : (
              <>
                {/* Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Ahorro mensual simulado</p>
                    <span className="text-sm font-bold tabular-nums text-primary">
                      {formatCLP(monthly)}
                    </span>
                  </div>
                  <Slider
                    min={MIN}
                    max={sliderMax}
                    step={STEP}
                    value={[monthly]}
                    onValueChange={([v]) => setMonthly(v)}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                    <span>{formatCLP(MIN)}</span>
                    <span>{formatCLP(sliderMax)}</span>
                  </div>
                </div>

                {/* Result */}
                <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-1 text-center">
                  <p className="text-xs text-muted-foreground">Con {maskAmount(monthly)} al mes</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {yearsMonths(simMonths)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {simMonths > 0 ? targetDate(simMonths) : ''}
                  </p>
                </div>

                {/* Comparison with current pace */}
                <div className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs',
                  isFaster ? 'bg-income/8 text-income' : 'bg-muted text-muted-foreground'
                )}>
                  <TrendingUp className={cn('size-4 shrink-0', isFaster ? 'text-income' : 'text-muted-foreground')} />
                  <div>
                    <span className="font-medium">Tu ritmo actual ({maskAmount(currentMonthlySavings)}/mes): </span>
                    <span>{yearsMonths(currentMonths)}</span>
                    {isFaster && (
                      <span className="ml-1 font-semibold">
                        · ahorras {yearsMonths(saved)} {saved === 1 ? '' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick presets */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">Sugerencias rápidas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[100_000, 200_000, 300_000, 500_000, 1_000_000]
                      .filter((v) => v <= sliderMax)
                      .map((v) => (
                        <Badge
                          key={v}
                          variant={monthly === v ? 'default' : 'outline'}
                          className="cursor-pointer text-xs hover:bg-primary/10 transition-colors"
                          onClick={() => setMonthly(v)}
                        >
                          {formatCLP(v)}
                        </Badge>
                      ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
