'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CategoryGrid from '@/components/categories/CategoryGrid'
import CategoryForm from '@/components/categories/CategoryForm'
import { useCategories } from '@/hooks/useCategories'
import type { Category } from '@/types/category.types'

export default function CategoriesPage() {
  const { data: categories } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const systemCount = categories?.filter((c) => c.isSystem).length ?? 0
  const customCount = categories?.filter((c) => !c.isSystem).length ?? 0

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingCategory(undefined)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {systemCount} del sistema · {customCount} personalizadas
          </p>
        </div>
        <Button onClick={() => { setEditingCategory(undefined); setFormOpen(true) }}>
          <Plus className="size-4 mr-1.5" /> Nueva categoría
        </Button>
      </div>

      <CategoryGrid onEdit={openEdit} />

      <CategoryForm
        open={formOpen}
        onClose={closeForm}
        category={editingCategory}
      />
    </div>
  )
}
