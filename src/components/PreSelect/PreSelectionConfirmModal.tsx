import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore'

interface PreSelectionConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

// Modal 不同状态的配置
const modalMap = {
  underSelected: {
    icon: <WarningOutlined className="text-red-400" />,
    title: '预选照片不足',
    titleColor: 'text-red-400',
    description: '您选择的照片距离套餐指定张数还差 5 张，如果继续可能影响后续产品选择。',
    actionText: '仍然确认',
    actionType: 'default' as const,
  },
  exactSelected: {
    icon: <CheckCircleOutlined className="text-green-400" />,
    title: '预选完成',
    titleColor: 'text-green-400',
    description: '您已完成照片预选，可以进入下一步进行产品选择。',
    actionText: '继续选择产品',
    actionType: 'primary' as const,
  },
  overSelected: {
    icon: <ExclamationCircleOutlined className="text-amber-400" />,
    title: '照片超选提醒',
    titleColor: 'text-amber-400',
    description: '您选择的照片超过了套餐规定数量，超出部分将产生额外费用。',
    actionText: '确认选择',
    actionType: 'default' as const,
  },
}

function PreSelectionConfirmModal({ open, onConfirm, onCancel }: PreSelectionConfirmModalProps) {
  const { getPreSelectedStats } = usePhotosStore()
  const { selectedCount, excludedCount, pendingCount } = getPreSelectedStats()

  // 计算预选状态
  const selectionStatus = useMemo(() => {
    const totalCount = selectedCount + excludedCount + pendingCount
    const processedCount = selectedCount + excludedCount
    const processedRate = processedCount / totalCount

    // 根据选择比例判断状态
    if (processedRate < 0.3) {
      return 'underSelected'
    }
    else if (processedRate >= 0.3 && processedRate <= 0.8) {
      return 'exactSelected'
    }
    else {
      return 'overSelected'
    }
  }, [selectedCount, excludedCount, pendingCount])

  const currentConfig = modalMap[selectionStatus]
  const totalCount = selectedCount + excludedCount + pendingCount
  const processedCount = selectedCount + excludedCount
  const processedPercent = Math.round((processedCount / totalCount) * 100)

  return (
    <CustomModal
      open={open}
      title={(
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 ${currentConfig.titleColor}`}>
            {currentConfig.icon}
            <span className="text-lg font-semibold">{currentConfig.title}</span>
          </div>
        </div>
      )}
      centered
      width={520}
      okText={currentConfig.actionText}
      onCancel={onCancel}
      onOk={onConfirm}
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
              : selectionStatus === 'underSelected' ? 'bg-orange-400' : 'bg-green-400'
          } rounded-full -translate-y-16 translate-x-16`}
          />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className={`text-base  ${
                selectionStatus === 'overSelected'
                  ? 'text-amber-400'
                  : selectionStatus === 'underSelected' ? 'text-orange-400' : 'text-green-400'
              }`}
              >
                {selectionStatus === 'overSelected' ? <WarningOutlined /> : selectionStatus === 'underSelected' ? <InfoCircleOutlined /> : <CheckCircleOutlined />}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-2 text-base ${
                  selectionStatus === 'overSelected'
                    ? 'text-amber-300'
                    : selectionStatus === 'underSelected' ? 'text-orange-300' : 'text-green-300'
                }`}
                >
                  {selectionStatus === 'overSelected'
                    ? '费用说明'
                    : selectionStatus === 'underSelected' ? '选择建议' : '完成提示'}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  selectionStatus === 'overSelected'
                    ? 'text-amber-200'
                    : selectionStatus === 'underSelected' ? 'text-orange-200' : 'text-green-200'
                }`}
                >
                  {selectionStatus === 'underSelected' && modalMap.underSelected.description}
                  {selectionStatus === 'exactSelected' && modalMap.exactSelected.description}
                  {selectionStatus === 'overSelected' && modalMap.overSelected.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-6">
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
            <span className="text-slate-200 font-semibold">处理进度</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-100">
                {processedPercent}
                %
              </span>
              <div
                className={
                  selectionStatus === 'underSelected'
                    ? 'w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-500'
                    : selectionStatus === 'exactSelected'
                      ? 'w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500'
                      : 'w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500'
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
                    : selectionStatus === 'exactSelected'
                      ? 'h-full transition-all duration-500 bg-gradient-to-r from-green-400 to-green-500'
                      : 'h-full transition-all duration-500 bg-gradient-to-r from-amber-400 to-amber-500'
                }
                style={{ width: `${processedPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            已处理
            {' '}
            {processedCount}
            {' '}
            张，共
            {' '}
            {totalCount}
            {' '}
            张照片
          </div>
        </div>

      </div>
    </CustomModal>
  )
}

export default PreSelectionConfirmModal
