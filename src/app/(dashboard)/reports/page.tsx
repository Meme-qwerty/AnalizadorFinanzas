'use client'

import { useState } from 'react'
import { Download, FileText, BarChart3, Tag, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategoryStats, useMonthlyStats } from '@/hooks/useAnalytics'
import { formatCLP, formatDate } from '@/lib/formatters'

type ReportType = 'transactions' | 'categories' | 'monthly'

interface ReportDef {
  id: ReportType
  title: string
  description: string
  icon: React.ElementType
  color: string
}

const REPORTS: ReportDef[] = [
  {
    id: 'transactions',
    title: 'Historial de transacciones',
    description: 'Exporta todas tus transacciones con categoría, cuenta y monto.',
    icon: FileText,
    color: 'text-primary',
  },
  {
    id: 'categories',
    title: 'Resumen por categoría',
    description: 'Totales y porcentajes de gasto agrupados por categoría.',
    icon: Tag,
    color: 'text-warning',
  },
  {
    id: 'monthly',
    title: 'Flujo mensual',
    description: 'Ingresos, gastos y ahorro mes a mes para el período seleccionado.',
    icon: BarChart3,
    color: 'text-income',
  },
]

function downloadCSV(filename: string, rows: string[][]) {
  const bom = '﻿'
  const csv = bom + rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const RECENT_EXPORTS = [
  { name: 'transacciones_abril_2026.csv', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), rows: 87 },
  { name: 'categorias_q1_2026.csv', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), rows: 5 },
]

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('2026-01-01')
  const [endDate, setEndDate] = useState('2026-05-31')
  const [exporting, setExporting] = useState<ReportType | null>(null)

  const { data: transactions } = useTransactions({})
  const { data: categories } = useCategoryStats()
  const { data: monthly } = useMonthlyStats(12)

  const handleExport = async (type: ReportType) => {
    setExporting(type)
    await new Promise((r) => setTimeout(r, 400))

    if (type === 'transactions' && transactions) {
      const header = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto (CLP)', 'Cuenta', 'Estado']
      const rows = transactions.map((tx) => [
        formatDate(tx.occurredAt),
        tx.description,
        tx.categoryId,
        tx.type === 'income' ? 'Ingreso' : tx.type === 'expense' ? 'Gasto' : 'Transferencia',
        String(tx.amount),
        tx.accountId,
        tx.status,
      ])
      downloadCSV(`transacciones_${startDate}_${endDate}.csv`, [header, ...rows])
    }

    if (type === 'categories' && categories) {
      const header = ['Categoría', 'Ícono', 'Monto (CLP)', 'Porcentaje', 'N° Transacciones']
      const rows = categories.map((c) => [
        c.categoryName,
        c.categoryIcon,
        String(c.amount),
        `${c.percentage.toFixed(1)}%`,
        String(c.transactionCount),
      ])
      downloadCSV(`categorias_${startDate}_${endDate}.csv`, [header, ...rows])
    }

    if (type === 'monthly' && monthly) {
      const header = ['Mes', 'Ingresos (CLP)', 'Gastos (CLP)', 'Ahorro (CLP)', 'Tasa de ahorro (%)']
      const rows = monthly.map((m) => [
        m.month,
        String(m.income),
        String(m.expenses),
        String(m.savings),
        `${m.savingsRate.toFixed(1)}%`,
      ])
      downloadCSV(`flujo_mensual_${startDate}_${endDate}.csv`, [header, ...rows])
    }

    setExporting(null)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Exporta tus datos financieros en formato CSV</p>
      </div>

      {/* Date range filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Período del reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-1.5 flex-1 min-w-32">
              <Label className="text-xs">Desde</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1.5 flex-1 min-w-32">
              <Label className="text-xs">Hasta</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report types */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Tipos de reporte</p>
        {REPORTS.map((report) => {
          const Icon = report.icon
          const isExporting = exporting === report.id
          return (
            <Card key={report.id} className="transition-colors hover:border-primary/40">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className={`size-5 ${report.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.description}</p>
                </div>
                <Button
                  variant="outline" size="sm"
                  disabled={isExporting}
                  onClick={() => handleExport(report.id)}
                  className="shrink-0"
                >
                  {isExporting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Exportando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Download className="size-3.5" /> CSV
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent exports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="size-4" /> Exportaciones recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {RECENT_EXPORTS.map((exp) => (
              <div key={exp.name} className="flex items-center gap-3 px-4 py-3">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exp.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(exp.date)} · {exp.rows} filas</p>
                </div>
                <Badge variant="secondary" className="text-xs">CSV</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Los archivos CSV usan codificación UTF-8 con BOM para compatibilidad con Excel.
      </p>
    </div>
  )
}
