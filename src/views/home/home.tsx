import FloatBtn from '@/components/FloatBtn/FloatBtn.tsx'
import { PhotoGrid } from '@/components/Photo/PhotoGrid.tsx'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { InfoCircleOutlined, LockOutlined, SyncOutlined } from '@ant-design/icons'
import { useContext, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { ConfirmModal } from './components/ConfirmModal.tsx'

function Home() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const previewMode = useAuthStore(state => state.isPreview)
  const orderInfo = useContext(OrderInfoContext)
  const products = useProductsStore(state => state.products)
  const isLoading = usePhotosStore(state => state.isLoading)

  const loadingCls = useMemo(() => {
    const cls = ['w-full', 'h-full']
    if (isLoading) {
      cls.push('flex', 'items-center', 'justify-center')
    }

    return cls.join(' ')
  }, [isLoading])

  // 统计已选照片数量
  const selectCount = useMemo(
    () => {
      const selectPhotos = new Set()
      products.forEach((product) => {
        product.selected_photos.forEach((photoId) => {
          selectPhotos.add(photoId)
        })
      })
      return selectPhotos.size
    },
    [products],
  )

  // 计算额外需要支付的照片费用
  const diffCount = useMemo(() => {
    if (orderInfo && orderInfo.max_select_photos) {
      return Math.max(0, selectCount - orderInfo.max_select_photos)
    }
    return 0
  }, [orderInfo, selectCount])

  return (
    <div className="bg-white">

    </div>
  )
}

export default Home
