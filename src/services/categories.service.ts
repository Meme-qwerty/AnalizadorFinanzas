import type { Category, CreateCategoryDTO } from '@/types/category.types'
import { SYSTEM_CATEGORIES } from '@/lib/constants'

const MOCK_CATEGORIES: Category[] = SYSTEM_CATEGORIES.map((c) => ({
  ...c,
  userId: undefined,
  parentId: undefined,
  isSystem: true,
  createdAt: new Date('2026-01-01'),
}))

let mockData = [...MOCK_CATEGORIES]

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    // TODO: return api.get('/categories').then(r => r.data)
    return mockData
  },

  async create(dto: CreateCategoryDTO): Promise<Category> {
    // TODO: return api.post('/categories', dto).then(r => r.data)
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      userId: 'user_1',
      parentId: dto.parentId,
      isSystem: false,
      createdAt: new Date(),
      ...dto,
    }
    mockData = [...mockData, newCategory]
    return newCategory
  },

  async delete(id: string): Promise<void> {
    // TODO: return api.delete(`/categories/${id}`)
    mockData = mockData.filter((c) => c.id !== id)
  },
}
