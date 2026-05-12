'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { Separator } from '@/components/ui/separator'

interface ShortcutEntry {
  keys: string[]
  description: string
}

const SHORTCUTS: { group: string; items: ShortcutEntry[] }[] = [
  {
    group: 'Navegación',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Búsqueda global' },
      { keys: ['?'], description: 'Mostrar atajos de teclado' },
    ],
  },
  {
    group: 'Acciones',
    items: [
      { keys: ['Ctrl', 'N'], description: 'Nueva transacción' },
      { keys: ['Ctrl', ','], description: 'Ir a configuración' },
      { keys: ['Esc'], description: 'Cerrar diálogo actual' },
    ],
  },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground min-w-6">
      {children}
    </kbd>
  )
}

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => setOpen((o) => !o), [])
  useKeyboardShortcut('?', toggle)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Atajos de teclado
            <Kbd>?</Kbd>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {SHORTCUTS.map((group, i) => (
            <div key={group.group}>
              {i > 0 && <Separator className="mb-4" />}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {group.group}
              </p>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.description} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, ki) => (
                        <span key={k} className="flex items-center gap-1">
                          {ki > 0 && <span className="text-muted-foreground/50 text-xs">+</span>}
                          <Kbd>{k}</Kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
