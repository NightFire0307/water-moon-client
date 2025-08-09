import { PackageIcon } from '@/assets/icon'
import CustomModal from '@/components/CustomModal/CustomModal'
import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { CheckCircleOutlined, GroupOutlined, InfoCircleOutlined, LoadingOutlined, LockOutlined, PictureOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'

interface ConfirmSelResModalProps {
  open: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

function ConfirmSelResModal({ open, onConfirm, onCancel }: ConfirmSelResModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { orderInfo } = useOrderStore()
  const { getPreSelectedPhotos } = usePhotosStore()
  const { products } = useProductsStore()

  const preSelectedPhotos = getPreSelectedPhotos()

  // 过滤已选照片数量
  const selectedCount = useMemo(() => {
    return preSelectedPhotos.filter(photo => photo.preSelectStatus === PreSelectStatus.SELECTED).length
  }, [preSelectedPhotos])

  // 计算超出数量
  const extraCount = useMemo(() => {
    return Math.max(0, selectedCount - (orderInfo?.maxSelectPhotos || 0))
  }, [orderInfo, selectedCount])

  const handleConfirm = () => {
    setIsSubmitting(true)
    // 这里可以添加实际的提交逻辑
    setTimeout(() => {
      // 提交完成后的处理
      setIsSubmitting(false)
      onConfirm?.()
    }, 2000)
  }

  return (
    <CustomModal
      open={open}
      title="确认提交选片结果"
      centered
      okText={isSubmitting ? '提交中...' : '确认并锁定提交'}
      okIcon={isSubmitting ? <LoadingOutlined /> : <LockOutlined />}
      onOk={handleConfirm}
      confirmLoading={isSubmitting}
      onCancel={onCancel}
      okButtonProps={{
        className: isSubmitting
          ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white font-bold text-base px-8 h-12 animate-pulse'
          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-red-500 text-white font-bold text-base px-8 h-12 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200',
      }}
    >
      <div className="py-6">
        <div className="mb-6 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-1000 ${
              isSubmitting
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 scale-110'
                : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
            }`}
          >
            <div className={`flex items-center justify-center transition-all duration-500 ${isSubmitting ? 'animate-pulse' : ''}`}>
              {isSubmitting
                ? (
                    <LoadingOutlined className="text-green-400 text-3xl" />
                  )
                : (
                    <CheckCircleOutlined className="text-blue-400 text-3xl" />
                  )}
            </div>
          </div>
          <p className="text-sm text-darkBlueGray-300">
            {isSubmitting ? '正在提交选片结果...' : '提交后将无法修改，请确认选片结果'}
          </p>
        </div>

        {/* 整体统计 */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* 套餐规定卡片 */}
          <div className="bg-darkBlueGray-800/40 backdrop-blur-sm border border-darkBlueGray-700/40 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-darkBlueGray-800/60 hover:border-darkBlueGray-600/60">
            <div className="w-12 h-12 mx-auto mb-4 bg-darkBlueGray-700/50 rounded-xl flex items-center justify-center">
              <GroupOutlined className="text-xl text-darkBlueGray-300" />
            </div>
            <div className="text-2xl font-bold text-darkBlueGray-200 mb-2">{orderInfo?.maxSelectPhotos ?? 0}</div>
            <div className="text-sm text-darkBlueGray-400 font-medium">套餐规定</div>
          </div>

          {/* 已选张数卡片 - 主要卡片 */}
          <div className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 backdrop-blur-sm border-2 border-blue-500/40 rounded-2xl p-5 text-center transition-all duration-300 hover:from-blue-500/20 hover:to-cyan-500/20 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden">
            {/* 背景装饰光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <PictureOutlined className="text-xl text-darkBlueGray-300" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-2xl font-bold text-blue-300">{ selectedCount }</div>
                {extraCount > 0 && (
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="text-sm text-blue-400 font-medium mb-1">已选择</div>

              {extraCount > 0 && (
                <div className="inline-flex items-center px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full">
                  <span className="text-xs text-amber-300 font-medium">
                    超出
                    {' '}
                    {extraCount}
                    {' '}
                    张
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 产品类型卡片 */}
          <div className="bg-darkBlueGray-800/30 backdrop-blur-sm border border-darkBlueGray-700/30 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-darkBlueGray-800/50 hover:border-darkBlueGray-600/50">
            <div className="w-12 h-12 mx-auto mb-4 bg-darkBlueGray-700/40 rounded-xl flex items-center justify-center">
              <PackageIcon className="text-xl text-darkBlueGray-300" />
            </div>
            <div className="text-xl font-bold text-darkBlueGray-300 mb-2">{ products.length }</div>
            <div className="text-sm text-darkBlueGray-500 font-medium">产品总数</div>
          </div>
        </div>

        {/* 选片核对提示 */}
        <div className="mb-6 p-4 rounded-lg bg-darkBlueGray-800/50 border border-darkBlueGray-700/50">
          <div className="flex items-start space-x-3">
            <InfoCircleOutlined className="text-base" />
            <div className="flex flex-col text-xs">
              <h4 className="text-sm font-medium text-white mb-2">选片核对说明</h4>
              <span className="font-medium text-darkBlueGray-300 mb-2">
                1、您当前选择了
                {' '}
                <span className="font-medium text-white">25张</span>
                {' '}
                照片。
              </span>
              <span className="font-medium text-darkBlueGray-300">2、超出数量后，我们的选片师将在 1-2 个工作日联系您</span>
            </div>
          </div>
        </div>

        {/* 提交后流程说明 */}
        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <InfoCircleOutlined className="text-base text-blue-400" />
            <div>
              <h4 className="text-sm font-medium text-blue-300 mb-2">提交后流程</h4>
              <div className="space-y-2 text-xs text-blue-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>您的选片结果将立即锁定，无法再次修改</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>专业修图师将在7天之内与您沟通修片要求</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span>成品将在您定稿之后30天内制作完毕</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最终确认提示 */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-xs text-amber-300 font-medium">最终确认</p>
              <p className="text-xs text-amber-200/80 mt-1">
                请仔细核对选片数量，点击"确认并提交"后将无法撤销
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ConfirmSelResModal
