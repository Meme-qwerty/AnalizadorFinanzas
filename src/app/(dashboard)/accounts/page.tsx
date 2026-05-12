'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Wallet, CreditCard, PiggyBank, Banknote, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccounts, useCreateAccount } from '@/hooks/useAccounts'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { createAccountSchema, type CreateAccountFormData } from '@/lib/validators'
import { formatCLP } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/account.types'

const ACCOUNT_TYPE_META = {
  checking: { label: 'Cuenta Corriente', icon: Wallet },
  savings: { label: 'Cuenta de Ahorro', icon: PiggyBank },
  credit: { label: 'Tarjeta de Crédito', icon: CreditCard },
  cash: { label: 'Efectivo', icon: Banknote },
  investment: { label: 'Inversión', icon: TrendingUp },
}

const ACCOUNT_COLORS = [
  '#3B82F6','#10B981','#EF4444','#F97316','#8B5CF6',
  '#EC4899','#06B6D4','#F59E0B','#84CC16','#6B7280',
]

function AccountCard({ account }: { account: Account }) {
  const { maskAmount } = usePrivacyMode()
  const meta = ACCOUNT_TYPE_META[account.type]
  const Icon = meta.icon
  const isNegative = account.balance < 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${account.color}20` }}>
              <Icon className="size-5" style={{ color: account.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold">{account.name}</p>
              <Badge variant="secondary" className="text-xs mt-0.5">{meta.label}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className={cn('text-lg font-bold tabular-nums', isNegative ? 'text-expense' : 'text-foreground')}>
              {maskAmount(account.balance)}
            </p>
            <p className="text-xs text-muted-foreground">{account.currency}</p>
          </div>
        </div>
        {account.lastSyncAt && (
          <p className="text-xs text-muted-foreground mt-3">
            Última sync: {new Date(account.lastSyncAt).toLocaleDateString('es-CL')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function AccountFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createAccount = useCreateAccount()
  const [selectedColor, setSelectedColor] = useState('#3B82F6')

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<CreateAccountFormData>({ resolver: zodResolver(createAccountSchema), defaultValues: { type: 'checking', balance: 0 } })

  const onSubmit = async (data: CreateAccountFormData) => {
    await createAccount.mutateAsync({ ...data, color: selectedColor })
    reset(); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Nueva cuenta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input placeholder="Ej: Cuenta Corriente BCI" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Controller control={control} name="type" render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_META).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </div>
          <div className="space-y-1.5">
            <Label>Saldo inicial (CLP)</Label>
            <Input type="number" {...register('balance', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {ACCOUNT_COLORS.map((color) => (
                <button key={color} type="button" onClick={() => setSelectedColor(color)}
                  className="size-7 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: color, outline: selectedColor === color ? `3px solid ${color}` : undefined, outlineOffset: '2px' }} />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear cuenta'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts()
  const { maskAmount } = usePrivacyMode()
  const [formOpen, setFormOpen] = useState(false)

  const totalBalance = accounts?.reduce((s, a) => s + a.balance, 0) ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cuentas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Saldo total: <span className="font-semibold text-foreground">{maskAmount(totalBalance)}</span>
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="size-4 mr-1.5" /> Nueva cuenta</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : !accounts?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">🏦</p>
          <p className="font-medium">Sin cuentas</p>
          <p className="text-sm text-muted-foreground mt-1">Agrega tus cuentas bancarias y tarjetas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((acc) => <AccountCard key={acc.id} account={acc} />)}
        </div>
      )}

      <AccountFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
