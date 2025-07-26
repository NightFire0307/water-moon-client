import { useLayoutEffect, useState } from 'react'

let isLoading: boolean = false
const listeners = new Set<(val: boolean) => void>()

function showLoading() {
  isLoading = true
  listeners.forEach(fn => fn(isLoading))
  console.log(listeners.size, 'listeners size')
}

function hideLoading() {
  isLoading = false
  listeners.forEach(fn => fn(isLoading))
}

export function useFullScreenLoading() {
  const [loading, setLoading] = useState(isLoading)

  useLayoutEffect(() => {
    const listener = (val: boolean) => setLoading(val)
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }, [])

  return { loading, showLoading, hideLoading }
}
