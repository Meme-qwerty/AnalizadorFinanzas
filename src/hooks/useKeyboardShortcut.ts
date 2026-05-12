import { useEffect } from 'react'

type ModifierKey = 'ctrl' | 'meta' | 'shift' | 'alt'

interface ShortcutOptions {
  modifiers?: ModifierKey[]
  enabled?: boolean
}

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  { modifiers = [], enabled = true }: ShortcutOptions = {}
) {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      const ctrlOrMeta = modifiers.includes('ctrl') || modifiers.includes('meta')
      if (ctrlOrMeta && !(e.ctrlKey || e.metaKey)) return
      if (modifiers.includes('shift') && !e.shiftKey) return
      if (modifiers.includes('alt') && !e.altKey) return
      if (e.key.toLowerCase() !== key.toLowerCase()) return

      e.preventDefault()
      callback(e)
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [key, callback, modifiers, enabled])
}
