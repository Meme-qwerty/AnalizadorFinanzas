'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Papa from 'papaparse'
import type { ParsedRow } from '@/types/import.types'

interface Props {
  onParsed: (headers: string[], rows: ParsedRow[], fileName: string) => void
}

export default function ImportDropzone({ onParsed }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parseFile = useCallback(
    (f: File) => {
      setError(null)
      if (!f.name.endsWith('.csv')) {
        setError('Solo se aceptan archivos CSV por ahora.')
        return
      }
      setFile(f)
      Papa.parse<ParsedRow>(f, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          const headers = results.meta.fields ?? []
          const rows = results.data as ParsedRow[]
          if (!headers.length || !rows.length) {
            setError('El archivo está vacío o no tiene el formato correcto.')
            setFile(null)
            return
          }
          onParsed(headers, rows, f.name)
        },
        error: () => {
          setError('No se pudo leer el archivo. Verifica que sea un CSV válido.')
          setFile(null)
        },
      })
    },
    [onParsed]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) parseFile(dropped)
    },
    [parseFile]
  )

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) parseFile(selected)
    e.target.value = ''
  }

  const clear = () => {
    setFile(null)
    setError(null)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/40'
        )}
      >
        {file ? (
          <>
            <div className="size-12 rounded-full bg-income/10 flex items-center justify-center">
              <FileText className="size-6 text-income" />
            </div>
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · Listo para mapear columnas
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clear}>
              <X className="size-3.5 mr-1" /> Cambiar archivo
            </Button>
          </>
        ) : (
          <>
            <div className={cn(
              'size-12 rounded-full flex items-center justify-center transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-muted'
            )}>
              <Upload className={cn('size-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="font-medium text-sm">
                {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo CSV aquí'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                o haz clic para seleccionar
              </p>
            </div>
            <label>
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={onFileInput}
              />
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">Seleccionar archivo</span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground">CSV · máx. 10 MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <X className="size-3.5 shrink-0" /> {error}
        </p>
      )}

      {/* Hint */}
      <div className="rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Formatos compatibles de cartola</p>
        <p>· BCI, Santander, BancoEstado, Falabella, Itaú</p>
        <p>· Columnas esperadas: fecha, descripción/glosa, monto/cargo/abono</p>
      </div>
    </div>
  )
}
