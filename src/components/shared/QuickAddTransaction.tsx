'use client'

import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useCreateTransaction } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { createTransactionSchema, type CreateTransactionFormData } from '@/lib/validators'
import { cn } from '@/lib/utils'

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Gasto', color: 'text-expense' },
  { value: 'income', label: 'Ingreso', color: 'text-income' },
  { value: 'transfer', label: 'Transferencia', color: 'text-muted-foreground' },
]

export function QuickAddTransaction() {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useKeyboardShortcut('n', toggle, { modifiers: ['ctrl'] })

  const { data: categories } = useCategories()
  const createTx = useCreateTransaction()

  const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } =
    useForm<CreateTransactionFormData>({
      resolver: zodResolver(createTransactionSchema),
      defaultValues: {
        type: 'expense',
        occurredAt: new Date(),
        categoryId: '',
        accountId: 'acc_1',
        tags: [],
      },
    })

  const txType = watch('type')

  const onSubmit = async (data: CreateTransactionFormData) => {
    await createTx.mutateAsync(data)
    reset()
    setOpen(false)
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="gap-1.5">
        <Plus className="size-3.5" />
        <span className="hidden sm:inline">Nueva</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ml-1">
          ⌃N
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva transacción</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {TYPE_OPTIONS.map((opt) => (
                <Controller
                  key={opt.value}
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors',
                        field.value === opt.value
                          ? `bg-background shadow ${opt.color}`
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {opt.label}
                    </button>
                  )}
                />
              ))}
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Input placeholder="Ej: Supermercado Lider" {...register('description')} autoFocus />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Monto (CLP)</Label>
              <Input
                type="number"
                min={1}
                placeholder="0"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>

            {txType !== 'income' && (
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Controller control={control} name="categoryId" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  txType === 'income' ? 'bg-income hover:bg-income/90' :
                  txType === 'expense' ? 'bg-destructive hover:bg-destructive/90' : ''
                )}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
