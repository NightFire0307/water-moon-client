import { useState } from 'react'
import CustomModal from '../CustomModal/CustomModal'

interface ResetSelectionModalProps {
  open: boolean
  onCancel?: () => void
}

function ResetSelectionModal({ open, onCancel }: ResetSelectionModalProps) {
  const [selectedResetOption, setSelectedResetOption] = useState<'all' | 'product' | null>(null)

  return (
    <CustomModal
      open={open}
      title="重置选片结果"
      centered
      onCancel={onCancel}
    >
      <div className="py-4">
        {/* 警告提示 */}
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-amber-300">
              <span className="font-medium">注意：</span>
              重置操作无法撤销，请谨慎选择合适的重置方式。
            </p>
          </div>
        </div>

        {/* 选项说明 */}
        <div className="space-y-4">
          <div
            className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
              selectedResetOption === 'all'
                ? 'bg-red-500/10 border-red-500/40 ring-2 ring-red-500/30'
                : 'bg-darkBlueGray-800/40 border-darkBlueGray-700/40 hover:bg-darkBlueGray-800/60 hover:border-darkBlueGray-600/60'
            }`}
            onClick={() => setSelectedResetOption('all')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selectedResetOption === 'all' ? 'bg-red-500/30' : 'bg-red-500/20'
              }`}
              >
                <svg className={`w-4 h-4 ${selectedResetOption === 'all' ? 'text-red-300' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className={`font-medium mb-1 ${selectedResetOption === 'all' ? 'text-red-200' : 'text-white'}`}>重选全部</h5>
                </div>
                <p className={`text-xs ${selectedResetOption === 'all' ? 'text-red-300/80' : 'text-darkBlueGray-400'}`}>清空所有选择结果，从头开始选片流程</p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
              selectedResetOption === 'product'
                ? 'bg-blue-500/10 border-blue-500/40 ring-2 ring-blue-500/30'
                : 'bg-darkBlueGray-800/40 border-darkBlueGray-700/40 hover:bg-darkBlueGray-800/60 hover:border-darkBlueGray-600/60'
            }`}
            onClick={() => setSelectedResetOption('product')}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selectedResetOption === 'product' ? 'bg-blue-500/30' : 'bg-blue-500/20'
              }`}
              >
                <svg className={`w-4 h-4 ${selectedResetOption === 'product' ? 'text-blue-300' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className={`font-medium mb-1 ${selectedResetOption === 'product' ? 'text-blue-200' : 'text-white'}`}>仅重选产品分配</h5>
                </div>
                <p className={`text-xs ${selectedResetOption === 'product' ? 'text-blue-300/80' : 'text-darkBlueGray-400'}`}>保留已选照片，仅重新分配照片到不同产品</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}

export default ResetSelectionModal
