import SummaryCards from '@/components/dashboard/SummaryCards'
import SpendingChart from '@/components/dashboard/SpendingChart'
import CashFlowChart from '@/components/dashboard/CashFlowChart'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import FinancialHealthScore from '@/components/dashboard/FinancialHealthScore'

export default function DashboardPage() {
  const now = new Date()
  const month = now.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5 capitalize">{month}</p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CashFlowChart />
        </div>
        <SpendingChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <FinancialHealthScore />
      </div>
    </div>
  )
}
