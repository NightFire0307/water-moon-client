import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'

import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'

interface PreSelectionConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

function PreSelectionConfirmModal({ open, onConfirm, onCancel }: PreSelectionConfirmModalProps) {
  const { getPreSelectedStats, setAllPendingToSelected } = usePhotosStore()
  const { order } = useOrderStore()
  const { selectedCount, excludedCount, pendingCount } = getPreSelectedStats()
  const [autoSelectedPending, setAutoSelectedPending] = useState(false) // 是否自动排除待处理照片

  // 计算预选状态
  const selectionStatus = useMemo(() => {
    if (!order) {
      return 'underSelected'
    }

    const maxSelectPhotos = order.maxSelectPhotos

    // 如果选择数量少于套餐数量
    if (selectedCount < maxSelectPhotos) {
      return 'underSelected'
    }
    // 如果选择数量等于套餐数量，但还有待处理照片
    else if (selectedCount === maxSelectPhotos && pendingCount > 0) {
      return 'exactSelectedWithPending'
    }
    // 如果选择数量等于套餐数量，且没有待处理照片
    else if (selectedCount === maxSelectPhotos && pendingCount === 0) {
      return 'exactSelected'
    }
    // 如果选择数量超过套餐数量
    else {
      return 'overSelected'
    }
  }, [selectedCount, pendingCount, order])

  // 处理确认按钮点击
  const handleConfirm = () => {
    if (autoSelectedPending) {
      setAllPendingToSelected()
    }

    // 调用原始的确认回调
    onConfirm?.()
  }

  // 计算选中和套餐差值
  const orderSelectedStats = useMemo(() => {
    if (order === null)
      return {}
    return {
      selectedDiff: order.maxSelectPhotos - selectedCount,
      overSelectedAmount: selectedCount - order.maxSelectPhotos > 0
        ? (selectedCount - order.maxSelectPhotos) * order.extraPhotoPrice
        : 0,
    }
  }, [order, selectedCount])

  // 计算套餐精修进度
  const packageProgress = useMemo(() => {
    if (!order)
      return { percent: 0, current: 0, target: 0 }

    const target = order.maxSelectPhotos
    const current = selectedCount
    const percent = Math.min(Math.round((current / target) * 100), 100)

    return { percent, current, target }
  }, [order, selectedCount])

  return (
    <CustomModal
      open={open}
      title={
        <span className="text-darkBlueGray-300">预选确认</span>
      }
      centered
      width={520}
      okText="确认"
      disabledOk={selectedCount === 0}
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <div className="space-y-5">
        {/* 核心统计 - 简化版 */}
        <div className="bg-darkBlueGray-800/50 rounded-xl p-5 border border-darkBlueGray-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-darkBlueGray-100 font-medium">预选进度</span>
            <div className={`flex items-center gap-2 text-2xl font-bold ${
              selectionStatus === 'overSelected'
                ? 'text-amber-400'
                : selectionStatus === 'underSelected'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
            }`}
            >
              {packageProgress.current}
              <span className="text-darkBlueGray-400 text-lg">/</span>
              {packageProgress.target}
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full h-2 bg-darkBlueGray-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 ${
                selectionStatus === 'overSelected'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : selectionStatus === 'underSelected'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(packageProgress.percent, 100)}%` }}
            />
          </div>

          {/* 状态提示 - 精简 */}
          <div className={`flex items-center gap-2 text-sm ${
            selectionStatus === 'overSelected'
              ? 'text-amber-300'
              : selectionStatus === 'underSelected'
                ? 'text-amber-300'
                : 'text-emerald-300'
          }`}
          >
            {selectionStatus === 'overSelected'
              ? <WarningOutlined />
              : selectionStatus === 'underSelected'
                ? <InfoCircleOutlined />
                : <CheckCircleOutlined />}
            <span>
              {selectionStatus === 'underSelected' && `还需选择 ${orderSelectedStats.selectedDiff} 张`}
              {selectionStatus === 'exactSelected' && '已完成套餐要求'}
              {selectionStatus === 'exactSelectedWithPending' && '已达要求，有待处理照片'}
              {selectionStatus === 'overSelected' && `超出指定张数 ${packageProgress.current - packageProgress.target} 张`}
            </span>
          </div>
        </div>

        {/* 待处理照片选项 - 简化版 */}
        {pendingCount > 0 && (
          <div className="bg-darkBlueGray-800/50 border border-darkBlueGray-600 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={autoSelectedPending}
                onChange={e => setAutoSelectedPending(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-cyan-500 bg-darkBlueGray-700 border-darkBlueGray-500 rounded focus:ring-cyan-500 focus:ring-2"
              />
              <div className="flex-1">
                <span className="text-darkBlueGray-100 text-sm group-hover:text-white transition-colors">
                  自动将
                  {' '}
                  {pendingCount}
                  {' '}
                  张待处理照片标记为"已选"
                </span>
                <p className="text-xs text-darkBlueGray-300 mt-1">
                  未勾选则这些照片不会进入下一步
                </p>
              </div>
            </label>
          </div>
        )}

        {/* 简化的统计 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-darkBlueGray-800/50 border border-emerald-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{selectedCount}</div>
            <div className="text-darkBlueGray-200 text-xs">已选择</div>
          </div>
          <div className="bg-darkBlueGray-800/50 border border-amber-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400 mb-1">{excludedCount}</div>
            <div className="text-darkBlueGray-200 text-xs">已排除</div>
          </div>
          <div className="bg-darkBlueGray-800/50 border border-darkBlueGray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-darkBlueGray-300 mb-1">{pendingCount}</div>
            <div className="text-darkBlueGray-200 text-xs">待处理</div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default PreSelectionConfirmModal
