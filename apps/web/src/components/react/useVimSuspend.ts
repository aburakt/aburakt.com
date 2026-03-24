import { useEffect } from 'react'

/**
 * Suspends VimNavigation while `active` is true.
 * Use in any interactive component (games, typing tests) that handles its own keyboard input.
 */
export function useVimSuspend(active: boolean) {
  useEffect(() => {
    if (active) {
      document.dispatchEvent(new CustomEvent('vim:suspend'))
      return () => { document.dispatchEvent(new CustomEvent('vim:resume')) }
    }
  }, [active])
}
