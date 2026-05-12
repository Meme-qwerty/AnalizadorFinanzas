import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { PageTransition } from '@/components/shared/PageTransition'
import { KeyboardShortcutsDialog } from '@/components/shared/KeyboardShortcutsDialog'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
      <KeyboardShortcutsDialog />
    </div>
  )
}
