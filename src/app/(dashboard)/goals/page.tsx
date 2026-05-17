'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, TrendingUp, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useGoals, useCreateGoal, useDeleteGoal, useAddContribution } from '@/hooks/useGoals'
import { useDashboardSummary } from '@/hooks/useAnalytics'
import { StaggerList, StaggerItem } from '@/components/shared/StaggerList'
import { GoalSimulator } from '@/components/goals/GoalSimulator'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { createGoalSchema, type CreateGoalFormData } from '@/lib/validators'
import { formatDate, formatPercentage } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types/goal.types'

const GOAL_ICONS = ['🎯','✈️','🚗','🏠','💻','📱','🎓','💍','🛡️','🌍','⛵','🎸','🏋️','🐾','🌱']

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void }) {
  const { maskAmount } = usePrivacyMode()
  const addContribution = useAddContribution()
  const [contributing, setContributing] = useState(false)
  const [amount, setAmount] = useState('')

  const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const isCompleted = goal.status === 'completed'

  // Monthly savings projection (based on 3 months average, mock)
  const monthlySavings = 712500
  const monthsLeft = remaining > 0 && monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0

  return (
    <Card className={cn(isCompleted && 'border-income/40 bg-income/[0.02]')}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
              {goal.icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{goal.name}</p>
              {goal.deadline && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="size-3" /> {formatDate(goal.deadline)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isCompleted && <Badge className="bg-income/10 text-income border-0 text-xs">✓ Lograda</Badge>}
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={() => onDelete(goal.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold tabular-nums text-income">{maskAmount(goal.currentAmount)}</span>
            <span className="text-muted-foreground tabular-nums">{maskAmount(goal.targetAmount)}</span>
          </div>
          <Progress value={pct} indicatorClassName={isCompleted ? 'bg-income' : 'bg-primary'} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPercentage(pct)}</span>
            {!isCompleted && <span>{maskAmount(remaining)} restante</span>}
          </div>
        </div>

        {!isCompleted && monthsLeft > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <TrendingUp className="size-3.5 shrink-0" />
            A tu ritmo actual, lo logras en ~{monthsLeft} {monthsLeft === 1 ? 'mes' : 'meses'}
          </div>
        )}

        {!isCompleted && (
          contributing ? (
            <div className="flex gap-2">
              <Input
                type="number" placeholder="Monto a aportar" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-8 text-sm"
              />
              <Button size="sm" className="h-8 shrink-0"
                disabled={!amount || addContribution.isPending}
                onClick={async () => {
                  await addContribution.mutateAsync({ id: goal.id, amount: Number(amount) })
                  setAmount(''); setContributing(false)
                }}
              >
                Aportar
              </Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setContributing(false)}>
                ✕
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => setContributing(true)}>
              + Registrar aporte
            </Button>
          )
        )}
      </CardContent>
    </Card>
  )
}

function GoalFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createGoal = useCreateGoal()
  const [selectedIcon, setSelectedIcon] = useState('🎯')

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<CreateGoalFormData>({ resolver: zodResolver(createGoalSchema), defaultValues: { icon: '🎯' } })

  const onSubmit = async (data: CreateGoalFormData) => {
    await createGoal.mutateAsync({ ...data, icon: selectedIcon })
    reset(); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Nueva meta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input placeholder="Ej: Vacaciones Europa" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Ícono</Label>
            <div className="grid grid-cols-8 gap-1">
              {GOAL_ICONS.map((e) => (
                <button key={e} type="button" onClick={() => setSelectedIcon(e)}
                  className={`text-xl p-1.5 rounded-lg hover:bg-muted transition-colors ${selectedIcon === e ? 'bg-muted ring-2 ring-primary' : ''}`}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Monto objetivo (CLP)</Label>
            <Input type="number" min={1} placeholder="0" {...register('targetAmount', { valueAsNumber: true })} />
            {errors.targetAmount && <p className="text-xs text-destructive">{errors.targetAmount.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Fecha límite (opcional)</Label>
            <Controller control={control} name="deadline" render={({ field }) => (
              <Input type="date" value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} />
            )} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear meta'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals()
  const { data: summary } = useDashboardSummary()
  const deleteGoal = useDeleteGoal()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const active = goals?.filter((g) => g.status === 'active') ?? []
  const completed = goals?.filter((g) => g.status === 'completed') ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Metas de ahorro</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} activa{active.length !== 1 ? 's' : ''} · {completed.length} completada{completed.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="size-4 mr-1.5" /> Nueva meta</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <>
              <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((g) => (
                  <StaggerItem key={g.id}>
                    <GoalCard goal={g} onDelete={setDeleteId} />
                  </StaggerItem>
                ))}
              </StaggerList>
              <GoalSimulator
                goals={active}
                currentMonthlySavings={summary?.monthlySavings}
              />
            </>
          )}
          {completed.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Metas completadas</p>
              <StaggerList className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completed.map((g) => (
                  <StaggerItem key={g.id}>
                    <GoalCard goal={g} onDelete={setDeleteId} />
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>
          )}
          {!goals?.length && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-4xl mb-3">🎯</p>
              <p className="font-medium">Sin metas aún</p>
              <p className="text-sm text-muted-foreground mt-1">Define tus objetivos financieros</p>
            </div>
          )}
        </div>
      )}

      <GoalFormModal open={formOpen} onClose={() => setFormOpen(false)} />
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta meta?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => { if (deleteId) { await deleteGoal.mutateAsync(deleteId); setDeleteId(null) } }}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
