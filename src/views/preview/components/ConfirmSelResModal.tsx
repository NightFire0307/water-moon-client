import CustomModal from '@/components/CustomModal/CustomModal'
import { CheckCircleOutlined, LoadingOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface ConfirmSelResModalProps {
  open: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

function ConfirmSelResModal({ open, onConfirm, onCancel }: ConfirmSelResModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      okText={isSubmitting ? '提交中...' : '确认并提交'}
      okIcon={<LockOutlined />}
      onOk={handleConfirm}
      confirmLoading={isSubmitting}
      onCancel={onCancel}
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
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-darkBlueGray-800/50 border border-darkBlueGray-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">25</div>
            <div className="text-sm text-darkBlueGray-300">已选照片</div>
          </div>
          <div className="rounded-lg bg-darkBlueGray-800/50 border border-darkBlueGray-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-sm text-darkBlueGray-300">产品数量</div>
          </div>
        </div>

        {/* 提交后流程说明 */}
        <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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

        {/* 选片核对提示 */}
        <div className="mb-6 p-4 rounded-lg bg-darkBlueGray-800/50 border border-darkBlueGray-700/50">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-darkBlueGray-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-2">选片核对说明</h4>
              <p className="text-xs text-darkBlueGray-300 mb-2">
                您当前选择了
                {' '}
                <span className="font-medium text-white">25张</span>
                {' '}
                照片，如超出套餐限制，我们的选片师将在1-2个工作日内为您核对并联系确认相关费用。
              </p>
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
