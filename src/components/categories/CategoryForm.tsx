'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCategory } from '@/hooks/useCategories'
import type { Category } from '@/types/category.types'

const EMOJI_OPTIONS = [
  '🍔','🛒','🚗','🚌','🏠','💡','🏥','💊','🎮','🎬',
  '🎵','📚','👕','👟','💄','✈️','🏖️','🎂','☕','🍕',
  '💰','💳','🏦','📱','💻','⚽','🏋️','🐾','🌿','⛽',
  '🎁','🔧','🏢','📦','💼','🎓','🩺','🍷','🛁','🌟',
]

const PRESET_COLORS = [
  '#EF4444','#F97316','#F59E0B','#84CC16','#10B981',
  '#06B6D4','#3B82F6','#8B5CF6','#EC4899','#6B7280',
  '#DC2626','#D97706','#65A30D','#059669','#0284C7',
  '#7C3AED','#DB2777','#475569','#16A34A','#1E40AF',
]

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  category?: Category
}

export default function CategoryForm({ open, onClose, category }: Props) {
  const createMutation = useCreateCategory()
  const isEditing = !!category

  const [selectedIcon, setSelectedIcon] = useState('📦')
  const [selectedColor, setSelectedColor] = useState('#6B7280')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (category) {
      reset({ name: category.name })
      setSelectedIcon(category.icon)
      setSelectedColor(category.color)
    } else {
      reset({ name: '' })
      setSelectedIcon('📦')
      setSelectedColor('#6B7280')
    }
  }, [category, reset])

  const onSubmit = async (data: FormData) => {
    await createMutation.mutateAsync({
      name: data.name,
      icon: selectedIcon,
      color: selectedColor,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div
              className="size-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: `${selectedColor}25` }}
            >
              {selectedIcon}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: selectedColor }}>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                {(errors.name ? 'Nombre inválido' : undefined) ?? 'Vista previa'}
              </p>
              <p className="text-xs text-muted-foreground">Así se verá tu categoría</p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Ej: Alimentación" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Ícono</Label>
            <div className="grid grid-cols-10 gap-1">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={`text-lg p-1 rounded-md hover:bg-muted transition-colors ${
                    selectedIcon === emoji ? 'bg-muted ring-2 ring-primary' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-10 gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="size-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: selectedColor === color ? `3px solid ${color}` : undefined,
                    outlineOffset: selectedColor === color ? '2px' : undefined,
                  }}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
