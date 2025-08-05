import PreSelect from '@/components/PreSelect/PreSelect'
import { syncPreSelectedPhotos } from '@/services/photoSyncService'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { type FC, useEffect, useRef } from 'react'

const PreSelectPage: FC = () => {
  const { fetchPhotos } = usePhotosStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchPhotos()

    intervalRef.current = setInterval(() => {
      syncPreSelectedPhotos()
    }, 1000)

    return () => {
      if (intervalRef.current) {
        console.log('卸载定时器', intervalRef.current)
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <PreSelect />
  )
}

export default PreSelectPage
