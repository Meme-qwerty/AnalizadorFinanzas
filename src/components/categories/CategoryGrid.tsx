'use client'

import { useState } from 'react'
import { Pencil, Trash2, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCategories, useDeleteCategory } from '@/hooks/useCategories'
import { useCategoryStats } from '@/hooks/useAnalytics'
import { formatCLP } from '@/lib/formatters'
import type { Category } from '@/types/category.types'

interface Props {
  onEdit: (category: Category) => void
}

function CategoryCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/50 flex gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function CategoryGrid({ onEdit }: Props) {
  const { data: categories, isLoading } = useCategories()
  const { data: categoryStats } = useCategoryStats()
  const deleteMutation = useDeleteCategory()
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const getStats = (categoryId: string) =>
    categoryStats?.find((s) => s.categoryId === categoryId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
      </div>
    )
  }

  if (!categories?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">🗂️</p>
        <p className="font-medium">Sin categorías</p>
        <p className="text-sm text-muted-foreground mt-1">Crea tu primera categoría personalizada</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => {
          const stats = getStats(cat.id)
          return (
            <Card key={cat.id} className="group hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="size-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: cat.color }}>
                        {cat.name}
                      </p>
                      {cat.isSystem && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="size-2.5" /> Sistema
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => onEdit(cat)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => !cat.isSystem && setDeleteTarget(cat)}
                          disabled={cat.isSystem}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {cat.isSystem ? 'No se puede eliminar (categoría del sistema)' : 'Eliminar'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
                  {stats ? (
                    <>
                      <span>{formatCLP(stats.amount)} gastado</span>
                      <span>·</span>
                      <span>{stats.transactionCount} movimientos</span>
                    </>
                  ) : (
                    <span>Sin movimientos este mes</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{deleteTarget?.name}&quot;. Las transacciones asociadas
              quedarán sin categoría. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteTarget) {
                  await deleteMutation.mutateAsync(deleteTarget.id)
                  setDeleteTarget(null)
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
