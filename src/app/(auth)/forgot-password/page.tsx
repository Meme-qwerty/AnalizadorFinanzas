'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { BarChart3, ArrowLeft, MailCheck } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email({ error: 'Ingresa un correo válido' }),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800))
    setSentEmail(data.email)
    setSent(true)
  }

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
          {sent ? (
            <>
              <div className="flex justify-center mb-2">
                <div className="size-12 rounded-full bg-income/10 flex items-center justify-center">
                  <MailCheck className="size-6 text-income" />
                </div>
              </div>
              <CardTitle className="text-lg text-center">Revisa tu correo</CardTitle>
              <CardDescription className="text-center">
                Enviamos instrucciones de recuperación a{' '}
                <span className="font-medium text-foreground">{sentEmail}</span>
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-lg">Recuperar contraseña</CardTitle>
              <CardDescription>
                Te enviaremos un enlace para restablecer tu contraseña
              </CardDescription>
            </>
          )}
        </CardHeader>

        {!sent && (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Correo electrónico</Label>
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  autoFocus
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
