export interface Category {
  id: string
  userId?: string
  name: string
  icon: string
  color: string
  parentId?: string
  isSystem: boolean
  createdAt: Date
}

export interface CreateCategoryDTO {
  name: string
  icon: string
  color: string
  parentId?: string
}
