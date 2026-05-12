export type GoalStatus = 'active' | 'completed' | 'cancelled'

export interface Goal {
  id: string
  userId: string
  name: string
  icon: string
  targetAmount: number
  currentAmount: number
  currency: string
  deadline?: Date
  status: GoalStatus
  createdAt: Date
}

export interface CreateGoalDTO {
  name: string
  icon: string
  targetAmount: number
  deadline?: Date
}
