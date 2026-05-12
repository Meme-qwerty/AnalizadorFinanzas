'use client'

import { CheckCircle, XCircle, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { ImportResult as ImportResultType } from '@/types/import.types'

interface Props {
  result: ImportResultType
  fileName: string
  onImportAnother: () => void
}

export default function ImportResult({ result, fileName, onImportAnother }: Props) {
  const success = result.imported > 0
  const total = result.imported + result.rejected + result.duplicates

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${
        success ? 'bg-income/10' : 'bg-expense/10'
      }`}>
        {success ? (
          <CheckCircle className="size-8 text-income shrink-0" />
        ) : (
          <XCircle className="size-8 text-expense shrink-0" />
        )}
        <div>
          <p className="font-semibold">
            {success ? '¡Importación completada!' : 'Importación sin resultados'}
          </p>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-income">{result.imported}</p>
            <p className="text-xs text-muted-foreground mt-1">Importadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">{result.duplicates}</p>
            <p className="text-xs text-muted-foreground mt-1">Duplicadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-expense">{result.rejected}</p>
            <p className="text-xs text-muted-foreground mt-1">Rechazadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Total procesadas: {total}</span>
          <span>{total > 0 ? Math.round((result.imported / total) * 100) : 0}% exitosas</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
          {result.imported > 0 && (
            <div
              className="h-full bg-income rounded-full"
              style={{ width: `${(result.imported / total) * 100}%` }}
            />
          )}
          {result.duplicates > 0 && (
            <div
              className="h-full bg-warning rounded-full"
              style={{ width: `${(result.duplicates / total) * 100}%` }}
            />
          )}
          {result.rejected > 0 && (
            <div
              className="h-full bg-expense rounded-full"
              style={{ width: `${(result.rejected / total) * 100}%` }}
            />
          )}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-income inline-block" /> Importadas</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-warning inline-block" /> Duplicadas</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-expense inline-block" /> Rechazadas</span>
        </div>
      </div>

      {/* Error details */}
      {result.errors.length > 0 && (
        <div className="space-y-2">
          <Separator />
          <p className="text-sm font-medium">Filas con errores</p>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {result.errors.map((err) => (
              <div key={err.row} className="flex items-start gap-2 text-xs">
                <span className="text-muted-foreground shrink-0">Fila {err.row}:</span>
                <span className="text-expense">{err.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onImportAnother} className="flex-1">
          <Copy className="size-3.5 mr-2" /> Importar otro archivo
        </Button>
        <Button asChild className="flex-1">
          <a href="/transactions">Ver transacciones →</a>
        </Button>
      </div>
    </div>
  )
}
