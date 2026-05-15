'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Dashboard error]', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
          <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-7 text-destructive" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">Algo salió mal</h2>
            <p className="text-sm text-muted-foreground">
              Ocurrió un error inesperado al cargar esta página.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/60 font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="size-4 mr-1.5" />
              Reintentar
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <ArrowLeft className="size-4 mr-1.5" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
