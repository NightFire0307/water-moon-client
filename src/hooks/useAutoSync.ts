import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

interface UseAutoSyncOptions {
  delay?: number // 同步间隔时间，默认10秒
  retryCount?: number // 重试次数，默认3次
  manualSync?: boolean // 是否手动同步，默认false
}

interface UseAutoSyncReturn {
  syncNow: () => Promise<void> // 立即同步函数
  syncDate: string // 上次同步时间
  startAutoSync: () => void // 开始自动同步函数
  stopAutoSync: () => void // 停止自动同步函数
}

export function useAutoSync(syncFn: () => Promise<void>, options?: UseAutoSyncOptions): UseAutoSyncReturn {
  const { delay = 10, retryCount = 3, manualSync = false } = options || {}
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentRetryCount = useRef(0)
  const isRunning = useRef(false) // 标记当前是否有同步任务在运行，防止重叠执行
  const [syncDate, setSyncDate] = useState<string>('') // 上次同步时间

  // 开始自动同步
  const startAutoSync = () => {
    if (intervalRef.current !== null) {
      console.warn('自动同步已在进行中')
      return
    }

    intervalRef.current = setInterval(async () => {
      if (isRunning.current)
        return // 如果上一个同步任务还在运行，跳过此次同步
      isRunning.current = true // 标记为正在运行

      try {
        await syncFn()
        currentRetryCount.current = 0 // 成功后重置重试计数
        setSyncDate(dayjs().format('YYYY-MM-DD HH:mm:ss'))
      }
      catch (err) {
        currentRetryCount.current += 1

        if (currentRetryCount.current >= retryCount) {
          console.warn('已达到最大重试次数，停止自动同步')
          clearInterval(intervalRef.current!)
          intervalRef.current = null
        }
      }
      finally {
        isRunning.current = false // 标记为不在运行
      }
    }, delay * 1000)
  }

  // 停止自动同步
  const stopAutoSync = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      currentRetryCount.current = 0 // 重置重试计数
    }
  }

  // 立即同步函数
  const syncNow = async () => {
    await syncFn()
  }

  useEffect(() => {
    if (!manualSync)
      startAutoSync()

    return () => stopAutoSync()
  }, [])

  return {
    syncNow,
    syncDate,
    startAutoSync,
    stopAutoSync,
  }
}
