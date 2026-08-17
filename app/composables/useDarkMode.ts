/**
 * Dark mode composable.
 * Defaults to system preference, allows manual toggle, persists to localStorage.
 */
export function useDarkMode() {
  const isDark = useState<boolean>('dark-mode', () => false)

  if (import.meta.client) {
    onMounted(() => {
      // Check localStorage first
      const stored = localStorage.getItem('shelf-dark-mode')
      if (stored !== null) {
        isDark.value = stored === 'true'
      } else {
        // Fall back to system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme(isDark.value)
    })

    watch(isDark, (val) => {
      localStorage.setItem('shelf-dark-mode', String(val))
      applyTheme(val)
    })
  }

  function applyTheme(dark: boolean) {
    if (import.meta.server) return
    const root = document.documentElement
    root.setAttribute('data-theme', dark ? 'dark' : 'light')
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggle,
  }
}
