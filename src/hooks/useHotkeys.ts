import { useEffect, useRef } from 'react'

interface HotkeyOption {
  key: string
  cb: (e: KeyboardEvent) => void
}

export function useHotkeys(hotkeys: HotkeyOption[]) {
  const hotkeysRef = useRef(hotkeys)

  // 每次渲染时更新 ref，确保 cb 始终是最新的
  useEffect(() => {
    hotkeysRef.current = hotkeys
  })

  useEffect(() => {
    function hotKeyHandler(e: KeyboardEvent) {
      hotkeysRef.current.forEach(({ key, cb }) => {
        if (key.toLowerCase() === e.code.toLowerCase()) {
          e.preventDefault()
          cb(e)
        }
      })
    }

    window.addEventListener('keydown', hotKeyHandler)
    return () => window.removeEventListener('keydown', hotKeyHandler)
  }, [])
}
