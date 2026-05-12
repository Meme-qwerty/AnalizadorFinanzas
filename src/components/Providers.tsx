'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'
import { useState } from 'react'
import { useThemeStore } from '@/store/theme.store'

function ToasterWithTheme() {
  const { resolvedTheme } = useThemeStore()
  return (
    <Toaster
      theme={resolvedTheme}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ duration: 3500 }}
    />
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <ToasterWithTheme />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
