'use client'

import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { loginSchema, type LoginFormData } from '@/lib/validators'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { isAuthenticated, setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const from = params.get('from') ?? '/dashboard'

  useEffect(() => {
    if (isAuthenticated) router.replace(from)
  }, [isAuthenticated, router, from])

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await authService.login(data)
      setUser(result.user, result.token)
      toast.success(`Bienvenido, ${result.user.name}`)
      router.replace(from)
    } catch {
      toast.error('Correo o contraseña incorrectos')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Correo electrónico</Label>
        <Input
          type="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          autoFocus
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Contraseña</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
          <BarChart3 className="size-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-semibold">AnalizadorFinanzas</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded-lg" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Crear cuenta
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground/50">
        Demo: cualquier correo y contraseña válidos
      </p>
    </div>
  )
}
