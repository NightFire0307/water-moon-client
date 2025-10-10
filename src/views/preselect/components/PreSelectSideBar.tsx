import { usePhotosStore } from '@/stores/usePhotosStore'
import { PreSelectStatus } from '@/types/selection/preSelection'
import { CheckOutlined, CloseOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { type CSSProperties, type FC, type ReactElement, useState } from 'react'

interface SideBarAction {
  key: string | number
  icon: ReactElement
  tooltip?: string
  type?: 'button' | 'divider'
  onClick?: () => void
}

interface PreSelectSideBarProps {
  actions: SideBarAction[]
  activeKey?: string | number
  direction?: 'vertical' | 'horizontal'
  className?: string
  style?: CSSProperties
}

const PreSelectSideBar: FC<PreSelectSideBarProps> = ({ actions, direction = 'horizontal', activeKey }) => {
  const { currentPhoto } = usePhotosStore()

  const activeClass = 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'

  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
      <div className="bg-darkBlueGray-800/80 backdrop-blur-md rounded-xl border border-darkBlueGray-600/30 shadow-2xl p-3">
        <div className="flex flex-col gap-3">

          {
            actions.map(action => (
              <Tooltip key={action.key} title={action.tooltip} placement="right">
                <button
                  type="button"
                  className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 group ${
                    action.key === activeKey
                      ? activeClass
                      : 'text-darkBlueGray-400 hover:text-white hover:bg-darkBlueGray-700/50 hover:shadow-md'
                  }`}
                  aria-label={action.tooltip}
                >
                  {action.icon}
                </button>
              </Tooltip>
            ))
          }

          {/* 分割线 */}
          <div className="w-full h-px bg-darkBlueGray-600/30"></div>

          {/* 图片操作工具 */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 text-darkBlueGray-400 hover:text-white hover:bg-darkBlueGray-700/50 hover:shadow-md group"
              title="放大图片"
            >
              <ZoomInOutlined className="text-lg" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 text-darkBlueGray-400 hover:text-white hover:bg-darkBlueGray-700/50 hover:shadow-md group"
              title="缩小图片"
            >
              <ZoomOutOutlined className="text-lg" />
            </button>
          </div>

          {/* 分割线 */}
          <div className="w-full h-px bg-darkBlueGray-600/30"></div>

          {/* 状态操作 */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 group ${
                currentPhoto?.preSelectStatus === PreSelectStatus.SELECTED
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-darkBlueGray-400 hover:text-white hover:bg-green-500/20 hover:shadow-md'
              }`}
              title="选择照片"
            >
              <CheckOutlined className="text-lg" />
            </button>
            <button
              type="button"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 group ${
                currentPhoto?.preSelectStatus === PreSelectStatus.EXCLUDED
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-darkBlueGray-400 hover:text-white hover:bg-red-500/20 hover:shadow-md'
              }`}
              title="排除照片"
            >
              <CloseOutlined className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreSelectSideBar
