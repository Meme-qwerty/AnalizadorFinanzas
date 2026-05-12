'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategories } from '@/hooks/useCategories'
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets'
import { createBudgetSchema, type CreateBudgetFormData } from '@/lib/validators'
import type { BudgetWithStats } from '@/types/budget.types'

interface Props {
  open: boolean
  onClose: () => void
  budget?: BudgetWithStats
}

const now = new Date()
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

export default function BudgetForm({ open, onClose, budget }: Props) {
  const { data: categories } = useCategories()
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const isEditing = !!budget

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<CreateBudgetFormData>({
      resolver: zodResolver(createBudgetSchema),
      defaultValues: {
        period: 'monthly',
        startDate: new Date(firstDay),
        endDate: new Date(lastDay),
      },
    })

  useEffect(() => {
    if (budget) {
      reset({
        categoryId: budget.categoryId,
        amount: budget.amount,
        period: budget.period,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      })
    } else {
      reset({ period: 'monthly', startDate: new Date(firstDay), endDate: new Date(lastDay) })
    }
  }, [budget, reset])

  const onSubmit = async (data: CreateBudgetFormData) => {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: budget.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onClose()
  }

  const toInput = (d: Date) => new Date(d).toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Controller control={control} name="categoryId" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Monto límite (CLP)</Label>
            <Input type="number" min={1} placeholder="0" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Período</Label>
            <Controller control={control} name="period" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Inicio</Label>
              <Controller control={control} name="startDate" render={({ field }) => (
                <Input type="date" value={field.value ? toInput(field.value) : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
              )} />
            </div>
            <div className="space-y-1.5">
              <Label>Fin</Label>
              <Controller control={control} name="endDate" render={({ field }) => (
                <Input type="date" value={field.value ? toInput(field.value) : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
              )} />
            </div>
          </div>
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
