import { useEffect, type FC } from 'react'
import PreSelect from '@/components/PreSelect/PreSelect'
import { usePhotosStore } from '@/stores/usePhotosStore'

const PreSelectPage: FC = () => {
  const { fetchPhotos } = usePhotosStore()

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <PreSelect />
  )
}

export default PreSelectPage
