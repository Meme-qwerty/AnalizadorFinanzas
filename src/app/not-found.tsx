'use client'

import Link from 'next/link'
import { BarChart3, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="size-8 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="text-6xl font-bold text-muted-foreground/30 tabular-nums">404</p>
          <h1 className="text-xl font-semibold">Página no encontrada</h1>
          <p className="text-sm text-muted-foreground">
            La ruta que buscas no existe o fue movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button asChild className="flex-1">
            <Link href="/dashboard">
              <ArrowLeft className="size-4 mr-1.5" />
              Ir al dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/transactions">
              <Search className="size-4 mr-1.5" />
              Ver transacciones
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
