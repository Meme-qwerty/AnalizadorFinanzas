import type { LoginFormData, RegisterFormData } from '@/lib/validators'

interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface AuthResult {
  user: User
  token: string
}

// Mock data - reemplazar por llamadas a API cuando el backend esté listo
const MOCK_USER: User = {
  id: 'user_1',
  name: 'Benjamín',
  email: 'benjamin@example.com',
}

export const authService = {
  async login(_credentials: LoginFormData): Promise<AuthResult> {
    // TODO: return api.post('/auth/login', credentials).then(r => r.data)
    return { user: MOCK_USER, token: 'mock-token-123' }
  },

  async register(_data: RegisterFormData): Promise<AuthResult> {
    // TODO: return api.post('/auth/register', data).then(r => r.data)
    return { user: MOCK_USER, token: 'mock-token-123' }
  },

  async logout(): Promise<void> {
    // TODO: return api.post('/auth/logout')
  },

  async me(): Promise<User> {
    // TODO: return api.get('/auth/me').then(r => r.data)
    return MOCK_USER
  },
}
