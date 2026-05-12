'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useRules, useCreateRule, useToggleRule, useDeleteRule } from '@/hooks/useRules'
import { useCategories } from '@/hooks/useCategories'
import { CONDITION_LABELS, ACTION_LABELS, formatRuleCondition, formatRuleAction, type CreateRuleDTO } from '@/services/rules.service'
import type { Rule } from '@/types/transaction.types'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ruleSchema = z.object({
  conditionType: z.enum(['description_contains', 'merchant_is', 'amount_gt', 'amount_lt', 'account_is']),
  conditionValue: z.string().min(1, 'Requerido'),
  actionType: z.enum(['set_category', 'set_tag', 'set_merchant']),
  actionValue: z.string().min(1, 'Requerido'),
})
type RuleFormData = z.infer<typeof ruleSchema>

function RuleRow({ rule, onToggle, onDelete }: { rule: Rule; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 py-3.5 group">
      <GripVertical className="size-4 text-muted-foreground/40 shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className={`text-sm font-medium ${!rule.isActive ? 'text-muted-foreground' : ''}`}>
          {formatRuleCondition(rule)}
        </p>
        <p className="text-xs text-muted-foreground">→ {formatRuleAction(rule)}</p>
      </div>
      <Badge variant={rule.isActive ? 'default' : 'secondary'} className="text-xs shrink-0">
        {rule.isActive ? 'Activa' : 'Inactiva'}
      </Badge>
      <Switch checked={rule.isActive} onCheckedChange={() => onToggle(rule.id)} />
      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(rule.id)}>
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}

function RuleFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createRule = useCreateRule()
  const { data: categories } = useCategories()

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } =
    useForm<RuleFormData>({ resolver: zodResolver(ruleSchema), defaultValues: { conditionType: 'description_contains', actionType: 'set_category' } })

  const actionType = watch('actionType')

  const onSubmit = async (data: RuleFormData) => {
    await createRule.mutateAsync(data as CreateRuleDTO)
    reset(); onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Nueva regla automática</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Condición</p>
            <div className="space-y-1.5">
              <Label>Tipo de condición</Label>
              <Controller control={control} name="conditionType" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONDITION_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              <Input placeholder="Ej: NETFLIX" {...register('conditionValue')} />
              {errors.conditionValue && <p className="text-xs text-destructive">{errors.conditionValue.message}</p>}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acción</p>
            <div className="space-y-1.5">
              <Label>Tipo de acción</Label>
              <Controller control={control} name="actionType" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-1.5">
              <Label>Valor</Label>
              {actionType === 'set_category' ? (
                <Controller control={control} name="actionValue" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              ) : (
                <Input placeholder={actionType === 'set_tag' ? 'Ej: suscripción' : 'Ej: Netflix'} {...register('actionValue')} />
              )}
              {errors.actionValue && <p className="text-xs text-destructive">{errors.actionValue.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear regla'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function RulesPage() {
  const { data: rules, isLoading } = useRules()
  const toggleRule = useToggleRule()
  const deleteRule = useDeleteRule()
  const [formOpen, setFormOpen] = useState(false)

  const active = rules?.filter((r) => r.isActive).length ?? 0

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reglas automáticas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {rules?.length ?? 0} reglas · {active} activa{active !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="size-4 mr-1.5" /> Nueva regla</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !rules?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-4xl mb-3">⚙️</p>
              <p className="font-medium">Sin reglas</p>
              <p className="text-sm text-muted-foreground mt-1">Las reglas categorizan tus transacciones automáticamente</p>
            </div>
          ) : (
            <div className="divide-y divide-border px-4">
              {rules.map((rule, i) => (
                <div key={rule.id}>
                  <RuleRow
                    rule={rule}
                    onToggle={(id) => toggleRule.mutate(id)}
                    onDelete={(id) => deleteRule.mutate(id)}
                  />
                  {i < rules.length - 1 && <Separator className="opacity-0" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RuleFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
