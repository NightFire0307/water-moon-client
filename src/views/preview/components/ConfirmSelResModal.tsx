import CustomModal from '@/components/CustomModal/CustomModal'
import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { PreSelectStatus } from '@/types/selection/preSelection'
import {
  InfoCircleOutlined,
  LoadingOutlined,
  LockOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { BoxesIcon, ImageIcon, PackageIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

interface ConfirmSelResModalProps {
  open: boolean
  onConfirm?: () => Promise<void>
  onCancel?: () => void
}

function ConfirmSelResModal({ open, onConfirm, onCancel }: ConfirmSelResModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { order } = useOrderStore()
  const { getPreSelectedPhotos } = usePhotosStore()
  const { products } = useProductsStore()

  const preSelectedPhotos = getPreSelectedPhotos()

  // 过滤已选照片数量
  const selectedCount = useMemo(() => {
    return preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.SELECTED).length
  }, [preSelectedPhotos])

  // 计算超出数量
  const extraCount = useMemo(() => {
    return Math.max(0, selectedCount - (order?.maxSelectPhotos || 0))
  }, [order, selectedCount])

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm?.()
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CustomModal
      open={open}
      title="提交后将无法修改，请确认选片结果"
      centered
      okText={isSubmitting ? '提交中...' : '确认并锁定提交'}
      okIcon={isSubmitting ? <LoadingOutlined /> : <LockOutlined />}
      onOk={handleConfirm}
      confirmLoading={isSubmitting}
      onCancel={onCancel}
      okButtonProps={{
        className: isSubmitting
          ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white font-bold text-base px-8 h-12'
          : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-amber-500 text-white font-bold text-base px-8 h-12 shadow-lg hover:shadow-amber-500/25',
      }}
    >
      <div className="py-6">
        {/* 核心统计 */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* 套餐规定 */}
          <div className="bg-darkBlueGray-800/50 border border-darkBlueGray-600/50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-darkBlueGray-700/50 rounded-lg flex items-center justify-center">
              <BoxesIcon className="text-darkBlueGray-300" />
            </div>
            <div className="text-2xl font-bold text-darkBlueGray-100 mb-1">{order?.maxSelectPhotos ?? 0}</div>
            <div className="text-xs text-darkBlueGray-300">套餐限定张数</div>
          </div>

          {/* 已选择 */}
          <div className="bg-darkBlueGray-800/50 border border-cyan-500/40 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className=" text-cyan-400" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="text-2xl font-bold text-cyan-300">{selectedCount}</div>
              {extraCount > 0 && (
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-xs text-cyan-300">已选张数</div>
            {extraCount > 0 && (
              <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full">
                <span className="text-xs text-amber-300">
                  超出
                  {' '}
                  {extraCount}
                  {' '}
                  张
                </span>
              </div>
            )}
          </div>

          {/* 产品总数 */}
          <div className="bg-darkBlueGray-800/50 border border-darkBlueGray-600/50 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-darkBlueGray-700/50 rounded-lg flex items-center justify-center">
              <PackageIcon className=" text-darkBlueGray-300" />
            </div>
            <div className="text-2xl font-bold text-darkBlueGray-100 mb-1">{products.length}</div>
            <div className="text-xs text-darkBlueGray-300">产品总数</div>
          </div>
        </div>

        {/* 提交说明 */}
        <div className="mb-5 bg-darkBlueGray-800/50 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InfoCircleOutlined className="text-cyan-400 text-base mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-cyan-300 mb-3">提交后流程</h4>
              <div className="space-y-2 text-xs text-darkBlueGray-200">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>选片结果将立即锁定，无法再次修改</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>修图师将在3天内与您沟通修片要求</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>成品将在定稿后30天内制作完毕</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最终确认提示 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <WarningOutlined className="text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-300 mb-1">请仔细核对</p>
              <p className="text-xs text-amber-200/80">
                点击确认后将无法撤销，请确保选片数量正确
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ConfirmSelResModal
