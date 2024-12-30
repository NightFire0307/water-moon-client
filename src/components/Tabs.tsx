import { Segmented } from 'antd'
import { useMemo } from 'react'
import { FILTER_TYPE, usePhotosStore } from '../stores/photosStore.tsx'

export function Tabs() {
  const filterPhotos = usePhotosStore(state => state.filterPhotos)
  const photos = usePhotosStore(state => state.photos)

  const allPhotos = photos.length
  const selectedPhotos = useMemo(() => photos.filter(photo => photo.markedProducts.length > 0).length, [photos])
  const unselectedPhotos = useMemo(() => photos.filter(photo => photo.markedProducts.length === 0).length, [photos])

  const options = useMemo(() => [
    {
      label: (
        <div className="flex items-center gap-2">
          全部 (
          {' '}
          {allPhotos}
          {' '}
          )
        </div>
      ),
      value: FILTER_TYPE.ALL,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          已选 (
          {' '}
          {selectedPhotos}
          {' '}
          )
        </div>
      ),
      value: FILTER_TYPE.SELECTED,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          未选 (
          {' '}
          {unselectedPhotos}
          {' '}
          )
        </div>
      ),
      value: FILTER_TYPE.UNSELECTED,
    },
  ], [allPhotos, selectedPhotos, unselectedPhotos])

  function handleChange(value: FILTER_TYPE) {
    filterPhotos(value)
  }

  return (
    <Segmented options={options} size="middle" onChange={handleChange} />
  )
}
