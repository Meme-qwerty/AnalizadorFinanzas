import { z } from 'zod'

export const createTransactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['income', 'expense', 'transfer']),
  description: z.string().min(1, 'La descripción es requerida').max(200),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  accountId: z.string().min(1, 'La cuenta es requerida'),
  occurredAt: z.date(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
})

export const createBudgetSchema = z.object({
  categoryId: z.string().min(1, 'La categoría es requerida'),
  amount: z.number().positive('El monto debe ser positivo'),
  period: z.enum(['monthly', 'quarterly', 'annual', 'custom']),
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'La fecha de fin debe ser posterior a la de inicio',
  path: ['endDate'],
})

export const createGoalSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  icon: z.string().min(1, 'Selecciona un ícono'),
  targetAmount: z.number().positive('El monto objetivo debe ser positivo'),
  deadline: z.date().optional(),
})

export const createAccountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  type: z.enum(['checking', 'savings', 'credit', 'cash', 'investment']),
  balance: z.number(),
  color: z.string().min(1, 'Selecciona un color'),
})

export const loginSchema = z.object({
  email: z.string().email({ error: 'Email inválido' }),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email({ error: 'Email inválido' }),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>
export type CreateBudgetFormData = z.infer<typeof createBudgetSchema>
export type CreateGoalFormData = z.infer<typeof createGoalSchema>
export type CreateAccountFormData = z.infer<typeof createAccountSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
