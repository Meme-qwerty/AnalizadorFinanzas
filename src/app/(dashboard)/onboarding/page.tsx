'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Wallet, Target, Tag, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ElementType
}

const STEPS: Step[] = [
  { id: 0, title: 'Bienvenido', description: 'Configura tu perfil', icon: BarChart3 },
  { id: 1, title: 'Primera cuenta', description: 'Agrega tu cuenta bancaria', icon: Wallet },
  { id: 2, title: 'Primer presupuesto', description: 'Define un límite de gasto', icon: Target },
  { id: 3, title: '¡Listo!', description: 'Explora AnalizadorFinanzas', icon: Check },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const isDone = i < current
        const isActive = i === current
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={cn(
              'size-8 rounded-full flex items-center justify-center transition-colors',
              isDone ? 'bg-income text-white' : isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-8 sm:w-16 transition-colors', i < current ? 'bg-income' : 'bg-border')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState('')
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
          <BarChart3 className="size-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Bienvenido a AnalizadorFinanzas</h2>
        <p className="text-sm text-muted-foreground">Tu plataforma de inteligencia financiera personal</p>
      </div>
      <div className="space-y-1.5">
        <Label>¿Cómo te llamas?</Label>
        <Input
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={onNext} disabled={!name.trim()}>
        Comenzar <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  )
}

function AccountStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [accountName, setAccountName] = useState('')
  const [balance, setBalance] = useState('')

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Agrega tu primera cuenta</h2>
        <p className="text-sm text-muted-foreground">Puedes agregar más cuentas después desde la sección Cuentas.</p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>Nombre de la cuenta</Label>
          <Input placeholder="Ej: Cuenta Corriente BCI" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Saldo actual (CLP)</Label>
          <Input type="number" placeholder="0" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onSkip}>Saltar</Button>
        <Button className="flex-1" onClick={onNext}>
          Agregar <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

function BudgetStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [limit, setLimit] = useState('')

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Crea tu primer presupuesto</h2>
        <p className="text-sm text-muted-foreground">Define un límite mensual para empezar a controlar tus gastos.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '🍔', label: 'Alimentación', amount: 200000 },
          { icon: '🚗', label: 'Transporte', amount: 100000 },
          { icon: '🎮', label: 'Entretenimiento', amount: 60000 },
          { icon: '🛍️', label: 'Compras', amount: 150000 },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => setLimit(String(c.amount))}
            className={cn(
              'p-3 rounded-lg border text-left transition-colors',
              limit === String(c.amount) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
            )}
          >
            <div className="text-xl">{c.icon}</div>
            <div className="text-xs font-medium mt-1">{c.label}</div>
            <div className="text-xs text-muted-foreground">${c.amount.toLocaleString('es-CL')}</div>
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label>O ingresa un monto personalizado</Label>
        <Input type="number" placeholder="Ej: 200000" value={limit} onChange={(e) => setLimit(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onSkip}>Saltar</Button>
        <Button className="flex-1" onClick={onNext}>
          Crear presupuesto <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

function DoneStep({ onFinish }: { onFinish: () => void }) {
  const features = [
    { icon: '📊', label: 'Dashboard con resumen financiero' },
    { icon: '📥', label: 'Importa cartolas desde CSV' },
    { icon: '🎯', label: 'Crea metas de ahorro' },
    { icon: '⚙️', label: 'Reglas automáticas de categorización' },
  ]

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="size-16 rounded-full bg-income/10 flex items-center justify-center mx-auto">
          <Check className="size-8 text-income" />
        </div>
        <h2 className="text-xl font-semibold">¡Todo listo!</h2>
        <p className="text-sm text-muted-foreground">Tu cuenta está configurada. Aquí tienes un resumen de lo que puedes hacer:</p>
      </div>
      <div className="space-y-2 text-left">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-3 text-sm">
            <span className="text-lg">{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={onFinish}>
        Ir al dashboard <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const finish = () => router.push('/dashboard')

  const pct = (step / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AnalizadorFinanzas</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <StepIndicator current={step} />
          <Progress value={pct} className="h-1.5" />
          <p className="text-xs text-muted-foreground text-right">Paso {step + 1} de {STEPS.length}</p>
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="p-6">
            {step === 0 && <WelcomeStep onNext={next} />}
            {step === 1 && <AccountStep onNext={next} onSkip={next} />}
            {step === 2 && <BudgetStep onNext={next} onSkip={next} />}
            {step === 3 && <DoneStep onFinish={finish} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
