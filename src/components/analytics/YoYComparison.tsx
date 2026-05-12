'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCLP } from '@/lib/formatters'

const MOCK_YOY = [
  { month: 'Ene', year2025: 480000, year2026: 610000 },
  { month: 'Feb', year2025: 520000, year2026: 450000 },
  { month: 'Mar', year2025: 430000, year2026: 530000 },
  { month: 'Abr', year2025: 490000, year2026: 498000 },
  { month: 'May', year2025: 510000, year2026: 487500 },
]

function CLPTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs space-y-1">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{formatCLP(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function YoYComparison() {
  const totalDiff = MOCK_YOY.reduce((s, m) => s + (m.year2026 - m.year2025), 0)
  const avgDiffPct = MOCK_YOY.reduce((s, m) => s + ((m.year2026 - m.year2025) / m.year2025) * 100, 0) / MOCK_YOY.length

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-base">Año vs año — Gastos</CardTitle>
        <div className="text-right">
          <p className={`text-sm font-bold ${totalDiff > 0 ? 'text-expense' : 'text-income'}`}>
            {totalDiff > 0 ? '+' : ''}{avgDiffPct.toFixed(1)}% vs 2025
          </p>
          <p className="text-xs text-muted-foreground">promedio mensual</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MOCK_YOY} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} className="fill-muted-foreground" width={52} />
            <Tooltip content={<CLPTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="year2025" name="2025" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="year2026" name="2026" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
