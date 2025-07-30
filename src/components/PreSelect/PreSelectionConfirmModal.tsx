import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'

import { useOrderStore } from '@/stores/useOrderStore'
import { usePhotosStore } from '@/stores/usePhotosStore'

interface PreSelectionConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

// Modal 不同状态的配置
const modalMap = {
  underSelected: {
    actionText: '仍然确认',
  },
  exactSelected: {
    actionText: '继续选择产品',
  },
  exactSelectedWithPending: {
    actionText: '继续选择产品',
  },
  overSelected: {
    actionText: '确认选择',
  },
}

function PreSelectionConfirmModal({ open, onConfirm, onCancel }: PreSelectionConfirmModalProps) {
  const { getPreSelectedStats, setAllPendingToSelected } = usePhotosStore()
  const { orderInfo } = useOrderStore()
  const { selectedCount, excludedCount, pendingCount } = getPreSelectedStats()
  const [autoSelectedPending, setAutoSelectedPending] = useState(false) // 是否自动排除待处理照片

  // 计算预选状态
  const selectionStatus = useMemo(() => {
    if (!orderInfo) {
      return 'underSelected'
    }

    const maxSelectPhotos = orderInfo.max_select_photos

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
  }, [selectedCount, pendingCount, orderInfo])

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
    if (orderInfo === null)
      return {}
    return {
      selectedDiff: orderInfo.max_select_photos - selectedCount,
      overSelectedAmount: selectedCount - orderInfo.max_select_photos > 0
        ? (selectedCount - orderInfo.max_select_photos) * orderInfo.extra_photo_price
        : 0,
    }
  }, [orderInfo, selectedCount])

  const currentConfig = modalMap[selectionStatus]

  // 计算套餐精修进度
  const packageProgress = useMemo(() => {
    if (!orderInfo)
      return { percent: 0, current: 0, target: 0 }

    const target = orderInfo.max_select_photos
    const current = selectedCount
    const percent = Math.min(Math.round((current / target) * 100), 100)

    return { percent, current, target }
  }, [orderInfo, selectedCount])

  return (
    <CustomModal
      open={open}
      title={
        <span className="text-darkBlueGray-300">预选确认</span>
      }
      centered
      width={520}
      okText={currentConfig.actionText}
      disabledOk={selectedCount === 0}
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <div className="space-y-6">
        {/* 状态提示卡片 */}
        <div className={`relative overflow-hidden rounded-xl p-5 ${
          selectionStatus === 'overSelected'
            ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20'
            : selectionStatus === 'underSelected'
              ? 'bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-red-500/10 border border-orange-500/20'
              : 'bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/10 border border-green-500/20'
        }`}
        >
          {/* 背景装饰 */}
          <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${
            selectionStatus === 'overSelected'
              ? 'bg-amber-400'
              : selectionStatus === 'underSelected'
                ? 'bg-orange-400'
                : 'bg-green-400'
          } rounded-full -translate-y-16 translate-x-16`}
          />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className={`text-base  ${
                selectionStatus === 'overSelected'
                  ? 'text-amber-400'
                  : selectionStatus === 'underSelected'
                    ? 'text-orange-400'
                    : 'text-green-400'
              }`}
              >
                {selectionStatus === 'overSelected'
                  ? <WarningOutlined />
                  : selectionStatus === 'underSelected'
                    ? <InfoCircleOutlined />
                    : <CheckCircleOutlined />}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 text-base ${
                  selectionStatus === 'overSelected'
                    ? 'text-amber-300'
                    : selectionStatus === 'underSelected'
                      ? 'text-orange-300'
                      : selectionStatus === 'exactSelectedWithPending'
                        ? 'text-green-300'
                        : 'text-green-300'
                }`}
                >
                  {selectionStatus === 'overSelected'
                    ? '费用说明'
                    : selectionStatus === 'underSelected'
                      ? '选择建议'
                      : selectionStatus === 'exactSelectedWithPending'
                        ? '完成提示'
                        : '完成提示'}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  selectionStatus === 'overSelected'
                    ? 'text-amber-200'
                    : selectionStatus === 'underSelected'
                      ? 'text-orange-200'
                      : 'text-green-200'
                }`}
                >
                  {selectionStatus === 'underSelected' && `您选择的照片距离套餐指定张数还差 ${orderSelectedStats.selectedDiff} 张，如果继续可能影响后续产品选择。`}
                  {selectionStatus === 'exactSelected' && '您已完成照片预选，可以进入下一步进行产品选择。'}
                  {selectionStatus === 'exactSelectedWithPending' && `您已选择了套餐要求的 ${selectedCount} 张照片。`}
                  {selectionStatus === 'overSelected' && `您选择的照片超过了套餐规定数量，超出部分将产生额外 ￥${orderSelectedStats.overSelectedAmount} 费用。`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 待处理照片提醒 - 所有状态下只要有待处理照片都显示 */}
        {pendingCount > 0 && (
          <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-slate-600/10 border border-slate-500/20">
            {/* 背景装饰 */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 bg-slate-400 rounded-full -translate-y-16 translate-x-16" />

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="text-base text-slate-400">
                  <InfoCircleOutlined />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-base text-slate-300">
                    待处理照片提醒
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    还有
                    {' '}
                    {pendingCount}
                    {' '}
                    张照片未处理，这些照片不会进入下一步产品选片环节。
                  </p>

                  <div className="mt-4 p-3 bg-slate-500/10 border border-slate-500/20 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer text-slate-300 hover:text-slate-200 transition-colors">
                      <input
                        type="checkbox"
                        checked={autoSelectedPending}
                        onChange={e => setAutoSelectedPending(e.target.checked)}
                        className="w-4 h-4 text-slate-500 bg-slate-900/50 border-slate-400 rounded focus:ring-slate-500 focus:ring-2"
                      />
                      <span className="text-sm">
                        自动将剩余
                        {' '}
                        {pendingCount}
                        {' '}
                        张待处理照片标记为"已选"
                      </span>
                    </label>
                    <p className="text-xs text-slate-400/70 mt-2 ml-7">
                      勾选此选项将自动处理所有待处理照片，确保没有照片遗漏
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-6 select-none">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 text-center hover:from-green-500/15 hover:to-green-600/15 transition-all duration-300">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <div className="text-3xl font-bold text-green-400">{selectedCount}</div>
              </div>
              <div className="text-green-300 text-sm font-medium tracking-wide">已选择</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6 text-center hover:from-red-500/15 hover:to-red-600/15 transition-all duration-300">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="text-3xl font-bold text-red-400">{excludedCount}</div>
              </div>
              <div className="text-red-300 text-sm font-medium tracking-wide">已排除</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20 rounded-xl p-6 text-center hover:from-slate-500/15 hover:to-slate-600/15 transition-all duration-300">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-slate-500/20 rounded-full flex items-center justify-center">
                <div className="text-3xl font-bold text-slate-400">{pendingCount}</div>
              </div>
              <div className="text-slate-300 text-sm font-medium tracking-wide">待处理</div>
            </div>
          </div>
        </div>

        {/* 进度展示 */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-200 font-semibold">套餐精修进度</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-100">
                {packageProgress.current}
                /
                {packageProgress.target}
              </span>
              <div
                className={
                  selectionStatus === 'underSelected'
                    ? 'w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500'
                    : selectionStatus === 'overSelected'
                      ? 'w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500'
                }
              />
            </div>
          </div>

          <div className="relative">
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={
                  selectionStatus === 'underSelected'
                    ? 'h-full transition-all duration-500 bg-gradient-to-r from-orange-400 to-orange-500'
                    : selectionStatus === 'overSelected'
                      ? 'h-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'h-full transition-all duration-500 bg-gradient-to-r from-green-400 to-green-500'
                }
                style={{ width: `${packageProgress.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            {selectionStatus === 'underSelected' && `还需选择 ${packageProgress.target - packageProgress.current} 张照片完成套餐要求`}
            {selectionStatus === 'exactSelected' && '已完成套餐要求的照片选择'}
            {selectionStatus === 'exactSelectedWithPending' && '已达到套餐要求，还有待处理照片'}
            {selectionStatus === 'overSelected' && `已超出套餐 ${packageProgress.current - packageProgress.target} 张照片`}
          </div>
        </div>

      </div>
    </CustomModal>
  )
}

export default PreSelectionConfirmModal
