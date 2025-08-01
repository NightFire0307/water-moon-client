import CustomModal from '@/components/CustomModal/CustomModal'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useMemo } from 'react'

interface ProductSelectConfirmModalProps {
  open: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

function ProductSelectConfirmModal({ open, onConfirm, onCancel }: ProductSelectConfirmModalProps) {
  const { products } = useProductsStore()
  const { productSelectedPhotos } = usePhotosStore()

  // 获取照片分配结果
  const assignedState = useMemo(() => {
    return {
      totalProducts: products.length,
      assignedPhotos: productSelectedPhotos.filter(photo => photo.selectedProducts.length > 0).length,
      unassignedPhotos: productSelectedPhotos.filter(photo => photo.selectedProducts.length === 0).length,
    }
  }, [products, productSelectedPhotos])

  // 是否有未分配的照片
  const hasUnassignedPhotos = useMemo(() => {
    return assignedState.unassignedPhotos > 0
  }, [assignedState.unassignedPhotos])

  return (
    <CustomModal
      open={open}
      title="确认完成分配"
      okText={hasUnassignedPhotos ? '请先完成照片分配' : '确认并预览'}
      disabledOk={hasUnassignedPhotos}
      centered
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <div className="py-4">
        {/* 提示信息 */}
        {hasUnassignedPhotos
          ? (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExclamationCircleOutlined className="text-red-400 text-lg mt-0.5" />
                  <div>
                    <div className="text-red-200 font-medium mb-1">警告：还有未分配的照片</div>
                    <div className="text-red-300 text-sm leading-relaxed">
                      检测到还有
                      {' '}
                      {assignedState.unassignedPhotos}
                      {' '}
                      张照片未分配给任何产品。
                      请完成所有照片的分配后再提交，或确认这些照片不需要分配。
                    </div>
                  </div>
                </div>
              </div>
            )
          : (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExclamationCircleOutlined className="text-green-400 text-lg mt-0.5" />
                  <div>
                    <div className="text-green-200 font-medium mb-1">选片完成</div>
                    <div className="text-green-300 text-sm leading-relaxed">
                      所有照片已完成分配，可以提交选片结果。
                      系统将自动保存您的选择并生成最终的选片报告。
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* 选片统计信息 */}
        <div className="space-y-4">
          <div className="text-slate-200 font-medium mb-3">选片统计</div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-slate-400 text-sm">产品总数</div>
              <div className="text-blue-400 text-xl font-bold">{assignedState.totalProducts}</div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-slate-400 text-sm">已分配照片</div>
              <div className="text-green-400 text-xl font-bold">{assignedState.assignedPhotos}</div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-slate-400 text-sm">未分配照片</div>
              <div className={`text-xl font-bold ${hasUnassignedPhotos ? 'text-red-400' : 'text-gray-400'}`}>
                {assignedState.unassignedPhotos}
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-slate-400 text-sm mb-2">产品选片详情</div>
            <div className="space-y-2 text-sm">
              {
                products.map(product => (
                  <div className="flex justify-between text-slate-300" key={product.productId}>
                    <span>{`• ${product.name}`}</span>
                    <span className="text-blue-400">{`${product.selectedPhotoIds.length}张 / ${product.photoLimit === 0 ? '∞' : product.photoLimit}张`}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ProductSelectConfirmModal
