import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore'
import { CheckCircleOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Progress, Space, Typography } from 'antd'
import { useMemo } from 'react'

const { Text } = Typography

interface PreSelectionConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

// Modal 不同状态的配置
const modalMap = {
  underSelected: {
    icon: <WarningOutlined className="text-orange-500" />,
    title: '预选照片不足',
    titleColor: 'text-orange-600',
    description: '当前选择的照片数量较少，可能影响后续产品选择。',
    actionText: '仍然确认',
    actionType: 'default' as const,
  },
  exactSelected: {
    icon: <CheckCircleOutlined className="text-green-500" />,
    title: '预选完成',
    titleColor: 'text-green-600',
    description: '您已完成照片预选，可以进入下一步进行产品选择。',
    actionText: '进入产品选择',
    actionType: 'primary' as const,
  },
  overSelected: {
    icon: <ExclamationCircleOutlined className="text-amber-500" />,
    title: '照片超选提醒',
    titleColor: 'text-amber-600',
    description: '您选择的照片数量较多，超出部分将产生额外费用。',
    actionText: '确认选择',
    actionType: 'default' as const,
  },
}

function PreSelectionConfirmModal({ open, onCancel }: PreSelectionConfirmModalProps) {
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
        <div className="text-xl font-semibold">
          {currentConfig.icon}
          <span className="ml-2">{currentConfig.title}</span>
        </div>
      )}
      centered
      footer={(
        <Space>
          <Button onClick={() => onCancel?.()}>返回修改</Button>
          <Button type={currentConfig.actionType}>
            {currentConfig.actionText}
          </Button>
        </Space>
      )}
      onCancel={onCancel}
    >
      <div className="space-y-5">
        {/* 主要状态展示 - 作为整体标题 */}
        <div className="text-center pb-4">
          <Text className="text-darkBlueGray-400">
            {currentConfig.description}
          </Text>
        </div>

        {/* 进度统计 */}
        <div className="bg-gradient-to-br from-darkBlueGray-50 to-darkBlueGray-100 rounded-xl p-5 border border-darkBlueGray-200">
          <div className="flex items-center justify-between mb-4">
            <Text className="text-darkBlueGray-700 font-semibold">预选进度</Text>
            <Text className="text-xl font-bold text-darkBlueGray-900">
              {processedPercent}
              %
            </Text>
          </div>
          <Progress
            percent={processedPercent}
            strokeColor={selectionStatus === 'underSelected' ? '#f59e0b' : selectionStatus === 'exactSelected' ? '#10b981' : '#f59e0b'}
            showInfo={false}
            strokeWidth={10}
            trailColor="#cbd5e1"
          />

          <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center gap-2 bg-darkBlueGray-25 rounded-full px-3 py-1 shadow-md border border-darkBlueGray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-darkBlueGray-700 font-medium">
                已选
                {' '}
                {selectedCount}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-darkBlueGray-25 rounded-full px-3 py-1 shadow-md border border-darkBlueGray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-darkBlueGray-700 font-medium">
                已排除
                {' '}
                {excludedCount}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-darkBlueGray-25 rounded-full px-3 py-1 shadow-md border border-darkBlueGray-100">
              <div className="w-2.5 h-2.5 rounded-full bg-darkBlueGray-400"></div>
              <span className="text-darkBlueGray-700 font-medium">
                待处理
                {' '}
                {pendingCount}
              </span>
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className={`${selectionStatus === 'overSelected'
          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
          : 'bg-gradient-to-r from-darkBlueGray-50 to-darkBlueGray-100 border border-darkBlueGray-200'
        } rounded-lg p-4`}
        >
          <div className="flex items-start">
            <div className={`${selectionStatus === 'overSelected' ? 'text-amber-500' : 'text-darkBlueGray-500'} mr-3 text-lg`}>
              {selectionStatus === 'overSelected' ? '⚠️' : '💡'}
            </div>
            <div>
              <Text className={`${selectionStatus === 'overSelected' ? 'text-amber-800' : 'text-darkBlueGray-800'} text-sm font-semibold block mb-2`}>
                {selectionStatus === 'overSelected' ? '费用提醒' : '温馨提示'}
              </Text>
              <Text className={`${selectionStatus === 'overSelected' ? 'text-amber-700' : 'text-darkBlueGray-700'} text-sm leading-relaxed`}>
                {selectionStatus === 'underSelected' && '建议继续预选更多照片，这样在产品选择阶段会有更多选择空间。'}
                {selectionStatus === 'exactSelected' && '继续下一步可以开始为不同产品选择对应的照片了。'}
                {selectionStatus === 'overSelected' && '超出基础套餐的部分单片将按 300 元/张 计费。'}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default PreSelectionConfirmModal
