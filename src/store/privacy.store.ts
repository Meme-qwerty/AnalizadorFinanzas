import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PrivacyState {
  privacyMode: boolean
  togglePrivacyMode: () => void
  setPrivacyMode: (value: boolean) => void
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      privacyMode: false,
      togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),
      setPrivacyMode: (value) => set({ privacyMode: value }),
    }),
    { name: 'privacy-storage' }
  )
)
