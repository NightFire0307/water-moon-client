import { type FC, useEffect } from 'react'
import PreSelect from '@/components/PreSelect/PreSelect'
import { useAutoSync } from '@/hooks/useAutoSync'
import { syncPreSelectedPhotos } from '@/services/photoSyncService'
import { usePhotosStore } from '@/stores/usePhotosStore'

const PreSelectPage: FC = () => {
  const { fetchPhotos } = usePhotosStore()
  useAutoSync(syncPreSelectedPhotos, { delay: 30 })

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <PreSelect />
  )
}

export default PreSelectPage
