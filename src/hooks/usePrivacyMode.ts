import { usePrivacyStore } from '@/store/privacy.store'
import { formatCLP } from '@/lib/formatters'

export function usePrivacyMode() {
  const { privacyMode, togglePrivacyMode, setPrivacyMode } = usePrivacyStore()

  const maskAmount = (amount: number): string => {
    if (privacyMode) return '• • • •'
    return formatCLP(amount)
  }

  return { privacyMode, togglePrivacyMode, setPrivacyMode, maskAmount }
}
