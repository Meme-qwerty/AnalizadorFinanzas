'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/hooks/useCategories'
import { useAccounts } from '@/hooks/useAccounts'
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions'
import { createTransactionSchema, type CreateTransactionFormData } from '@/lib/validators'
import type { Transaction } from '@/types/transaction.types'

interface Props {
  open: boolean
  onClose: () => void
  transaction?: Transaction
}

export default function TransactionForm({ open, onClose, transaction }: Props) {
  const { data: categories } = useCategories()
  const { data: accounts } = useAccounts()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const isEditing = !!transaction

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'expense',
      occurredAt: new Date(),
      tags: [],
    },
  })

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        categoryId: transaction.categoryId,
        accountId: transaction.accountId,
        occurredAt: new Date(transaction.occurredAt),
        notes: transaction.notes,
        tags: transaction.tags,
      })
    } else {
      reset({ type: 'expense', occurredAt: new Date(), tags: [] })
    }
  }, [transaction, reset])

  const onSubmit = async (data: CreateTransactionFormData) => {
    if (isEditing) {
      await updateMutation.mutateAsync({ id: transaction.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    onClose()
  }

  const toDateInputValue = (date: Date) =>
    date.toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar transacción' : 'Nueva transacción'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">💸 Gasto</SelectItem>
                    <SelectItem value="income">💰 Ingreso</SelectItem>
                    <SelectItem value="transfer">🔄 Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto (CLP)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              min={0}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" placeholder="Ej: Supermercado Lider" {...register('description')} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category + Account row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Cuenta</Label>
              <Controller
                control={control}
                name="accountId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.accountId && (
                <p className="text-xs text-destructive">{errors.accountId.message}</p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="occurredAt">Fecha</Label>
            <Controller
              control={control}
              name="occurredAt"
              render={({ field }) => (
                <Input
                  id="occurredAt"
                  type="date"
                  value={field.value ? toDateInputValue(new Date(field.value)) : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea id="notes" placeholder="Agrega un comentario..." rows={2} {...register('notes')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear transacción'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
