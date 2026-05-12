'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ImportDropzone from '@/components/imports/ImportDropzone'
import ImportColumnMapper from '@/components/imports/ImportColumnMapper'
import ImportResult from '@/components/imports/ImportResult'
import { useQuery } from '@tanstack/react-query'
import { importsService, autoDetectColumns } from '@/services/imports.service'
import { formatDate, formatDateRelative } from '@/lib/formatters'
import type { ColumnMapping, ParsedRow, ValidatedRow, ImportResult as ImportResultType } from '@/types/import.types'

type Step = 'upload' | 'map' | 'result'

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completado', className: 'text-income' },
  error: { label: 'Error', className: 'text-expense' },
  processing: { label: 'Procesando', className: 'text-warning' },
  pending: { label: 'Pendiente', className: 'text-muted-foreground' },
}

export default function ImportsPage() {
  const [step, setStep] = useState<Step>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<ColumnMapping>({})
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<ImportResultType | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const { data: history, isLoading: historyLoading, refetch } = useQuery({
    queryKey: ['imports', 'history'],
    queryFn: () => importsService.getHistory(),
  })

  const handleParsed = (h: string[], r: ParsedRow[], name: string) => {
    setHeaders(h)
    setRows(r)
    setFileName(name)
    setMapping(autoDetectColumns(h))
    setStep('map')
  }

  const handleImport = async (
    validatedRows: ValidatedRow[],
    accountId: string,
    categoryId: string,
  ) => {
    setIsImporting(true)
    try {
      const importResult = await importsService.processImport(
        validatedRows, fileName, categoryId, accountId,
      )
      setResult(importResult)
      setStep('result')
      void refetch()
      if (importResult.imported > 0) {
        toast.success(`${importResult.imported} transacciones importadas`)
      }
      if (importResult.rejected > 0) {
        toast.warning(`${importResult.rejected} filas con errores no fueron importadas`)
      }
    } finally {
      setIsImporting(false)
    }
  }

  const reset = () => {
    setStep('upload')
    setHeaders([])
    setRows([])
    setMapping({})
    setFileName('')
    setResult(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Importar datos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Carga tu cartola bancaria en formato CSV
        </p>
      </div>

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">Nueva importación</TabsTrigger>
          <TabsTrigger value="history">
            Historial
            {(history?.length ?? 0) > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0 h-4">
                {history?.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Import flow */}
        <TabsContent value="import" className="mt-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6 text-xs">
            {(['upload', 'map', 'result'] as Step[]).map((s, i) => {
              const labels = { upload: 'Cargar archivo', map: 'Mapear columnas', result: 'Resultado' }
              const isActive = step === s
              const isPast = ['upload', 'map', 'result'].indexOf(step) > i
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 ${isActive ? 'text-primary font-semibold' : isPast ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                    <span className={`size-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-primary text-primary-foreground' :
                      isPast ? 'bg-muted' : 'bg-muted/50'
                    }`}>{i + 1}</span>
                    {labels[s]}
                  </div>
                  {i < 2 && <span className="text-border">›</span>}
                </div>
              )
            })}
          </div>

          <Card>
            <CardContent className="p-6">
              {step === 'upload' && <ImportDropzone onParsed={handleParsed} />}

              {step === 'map' && (
                <ImportColumnMapper
                  headers={headers}
                  rows={rows}
                  initialMapping={mapping}
                  fileName={fileName}
                  onImport={handleImport}
                  onBack={reset}
                />
              )}

              {step === 'result' && result && (
                <ImportResult
                  result={result}
                  fileName={fileName}
                  onImportAnother={reset}
                />
              )}

              {isImporting && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">Importando transacciones...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Historial de importaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
                </div>
              ) : !history?.length ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Sin importaciones aún
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {history.map((job) => {
                    const status = STATUS_LABELS[job.status] ?? STATUS_LABELS.pending
                    return (
                      <div key={job.id} className="flex items-center justify-between py-3.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{job.fileName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(job.createdAt)} · {formatDateRelative(job.createdAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-4 space-y-0.5">
                          <p className={`text-xs font-medium ${status.className}`}>{status.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.importedRows} importadas · {job.duplicateRows} dup · {job.rejectedRows} err
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
