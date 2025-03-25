import FloatBtn from '@/components/FloatBtn/FloatBtn.tsx'
import { PhotoGrid } from '@/components/Photo/PhotoGrid.tsx'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { PreviewModeContext } from '@/contexts/PreviewModeContext.ts'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { ArrowRightOutlined, InfoCircleOutlined, LockOutlined } from '@ant-design/icons'
import { useContext, useMemo, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { ConfirmModal } from './components/ConfirmModal.tsx'

function Home() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const previewMode = useContext(PreviewModeContext)
  const orderInfo = useContext(OrderInfoContext)
  const products = useProductsStore(state => state.products)

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

  function handleSubmit() {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex items-center gap-2 mb-2 flex-grow-0">
        <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
        <div className="text-xl font-bold text-darkBlueGray-800">全部照片库</div>
        <div className="text-darkBlueGray-600 font-medium">
          (
          {orderInfo?.total_photos}
          {' '}
          张照片)
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <SimpleBar style={{ maxHeight: '100%' }}>
            <PhotoGrid />
          </SimpleBar>
        </div>
      </div>

      <FloatBtn
        title={previewMode ? '预览模式' : '提交选片结果'}
        desc={previewMode
          ? '当前模式不可修改'
          : (
              <span>
                已选:
                {' '}
                {selectCount}
                {' '}
                / 应选:
                {' '}
                {orderInfo?.max_select_photos}
              </span>
            )}
        addonIcon={previewMode ? <InfoCircleOutlined /> : <LockOutlined />}
        afterIcon={!previewMode ? <ArrowRightOutlined /> : undefined}
        onClick={() => setConfirmOpen(true)}
      />

      <ConfirmModal
        open={confirmOpen}
        confirmLoading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Home
