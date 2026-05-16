'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { TransactionFilters } from '@/types/transaction.types'

interface Props {
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

interface Preset {
  label: string
  start: () => Date
  end: () => Date
}

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
function endOfDay(d: Date)   { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999) }

function getPresets(): Preset[] {
  const now = new Date()
  const dow = now.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow

  return [
    {
      label: 'Hoy',
      start: () => startOfDay(now),
      end:   () => endOfDay(now),
    },
    {
      label: 'Esta semana',
      start: () => { const d = new Date(now); d.setDate(now.getDate() + mondayOffset); return startOfDay(d) },
      end:   () => endOfDay(now),
    },
    {
      label: 'Este mes',
      start: () => new Date(now.getFullYear(), now.getMonth(), 1),
      end:   () => new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    },
    {
      label: 'Mes pasado',
      start: () => new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end:   () => new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
    },
    {
      label: 'Últimos 7 días',
      start: () => { const d = new Date(now); d.setDate(now.getDate() - 6); return startOfDay(d) },
      end:   () => endOfDay(now),
    },
    {
      label: 'Últimos 30 días',
      start: () => { const d = new Date(now); d.setDate(now.getDate() - 29); return startOfDay(d) },
      end:   () => endOfDay(now),
    },
  ]
}

function toInputValue(d: Date | undefined): string {
  if (!d) return ''
  return d.toISOString().split('T')[0]
}

function formatShort(d: Date): string {
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

export function DateRangeFilter({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [customStart, setCustomStart] = useState(toInputValue(filters.startDate))
  const [customEnd,   setCustomEnd]   = useState(toInputValue(filters.endDate))

  const hasDate = !!(filters.startDate || filters.endDate)

  const buttonLabel = (() => {
    if (!hasDate) return 'Fecha'
    if (activePreset) return activePreset
    const parts = [
      filters.startDate ? formatShort(filters.startDate) : null,
      filters.endDate   ? formatShort(filters.endDate)   : null,
    ].filter(Boolean)
    return parts.join(' – ')
  })()

  const applyPreset = (preset: Preset) => {
    const start = preset.start()
    const end   = preset.end()
    onChange({ ...filters, startDate: start, endDate: end })
    setActivePreset(preset.label)
    setCustomStart(toInputValue(start))
    setCustomEnd(toInputValue(end))
    setOpen(false)
  }

  const applyCustom = () => {
    onChange({
      ...filters,
      startDate: customStart ? startOfDay(new Date(customStart + 'T12:00:00')) : undefined,
      endDate:   customEnd   ? endOfDay(new Date(customEnd   + 'T12:00:00')) : undefined,
    })
    setActivePreset(null)
    setOpen(false)
  }

  const clear = () => {
    onChange({ ...filters, startDate: undefined, endDate: undefined })
    setActivePreset(null)
    setCustomStart('')
    setCustomEnd('')
    setOpen(false)
  }

  const PRESETS = getPresets()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasDate ? 'secondary' : 'outline'}
          size="sm"
          className={cn('h-10 gap-1.5 text-sm font-normal', hasDate && 'text-foreground')}
        >
          <Calendar className="size-3.5 text-muted-foreground" />
          {buttonLabel}
          {hasDate && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); clear() }}
              className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5 transition-colors"
              aria-label="Limpiar fechas"
            >
              <X className="size-3" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-3 space-y-3">
        {/* Presets */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Rangos rápidos</p>
          <div className="grid grid-cols-2 gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={cn(
                  'text-xs px-2.5 py-1.5 rounded-lg text-left transition-colors',
                  activePreset === p.label
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom range */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Rango personalizado</p>
          <div className="space-y-1.5">
            <Input
              type="date"
              value={customStart}
              max={customEnd || undefined}
              onChange={(e) => { setCustomStart(e.target.value); setActivePreset(null) }}
              className="h-8 text-xs"
            />
            <Input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              onChange={(e) => { setCustomEnd(e.target.value); setActivePreset(null) }}
              className="h-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            className="w-full h-8 text-xs"
            onClick={applyCustom}
            disabled={!customStart && !customEnd}
          >
            Aplicar rango
          </Button>
        </div>

        {hasDate && (
          <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={clear}>
            Limpiar fechas
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}
