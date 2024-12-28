import { Segmented } from 'antd'
import { FILTER_TYPE, usePhotosStore } from '../stores/photosStore.tsx'

export function Tabs() {
  const filterPhotos = usePhotosStore(state => state.filterPhotos)

  const options = [
    {
      label: (
        <div className="flex items-center gap-2">
          全部 ( 99 )
        </div>
      ),
      value: FILTER_TYPE.ALL,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          已选 ( 1 )
        </div>
      ),
      value: FILTER_TYPE.SELECTED,
    },
    {
      label: (
        <div className="flex items-center gap-2">
          未选 ( 98 )
        </div>
      ),
      value: FILTER_TYPE.UNSELECTED,
    },
  ]

  function handleChange(value: FILTER_TYPE) {
    filterPhotos(value)
  }

  return (
    <Segmented options={options} size="middle" onChange={handleChange} />
  )
}
