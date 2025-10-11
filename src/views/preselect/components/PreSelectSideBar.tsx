import { Tooltip } from 'antd'
import cs from 'classnames'
import { type FC, type ReactElement, useEffect, useState } from 'react'

interface SideBarAction {
  key: string | number // 唯一标识
  icon?: ReactElement // 图标
  tooltip?: string // 提示信息
  type?: 'button' | 'divider' // 类型：按钮或分割线
  active?: boolean // 是否高亮
  className?: string // 自定义样式
  activeClassName?: string // 激活时的自定义样式
  independent?: boolean // 是否独立（不受其他按钮影响）
  onClick?: () => void // 点击事件
}

interface PreSelectSideBarProps {
  actions: SideBarAction[]
  activeKey?: string | number
  direction?: 'vertical' | 'horizontal'
  onChange?: (key: string | number) => void
}

const PreSelectSideBar: FC<PreSelectSideBarProps> = ({ actions, direction = 'vertical', activeKey, onChange }) => {
  const [selectedKey, setSelectedKey] = useState<string | number | undefined>(activeKey ?? actions.length > 0 ? actions[0].key : undefined)

  const activeClass = 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'

  useEffect(() => {
    if (activeKey !== undefined)
      setSelectedKey(activeKey)
  }, [activeKey])

  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
      <div className={
        cs(
          'bg-darkBlueGray-800/80 backdrop-blur-md rounded-xl border border-darkBlueGray-600/30 shadow-2xl p-2',
          direction === 'horizontal' ? 'h-16' : 'w-16',
        )
      }
      >
        <div className={
          cs(
            'flex items-center justify-center gap-2',
            direction === 'vertical' ? 'flex-col' : 'flex-row',
          )
        }
        >
          {
            actions.map((action) => {
              if (action.type === 'button') {
                const isActive = action.independent
                  ? !!action.active
                  : action.key === selectedKey

                return (
                  <Tooltip key={action.key} title={action.tooltip} placement={direction === 'vertical' ? 'right' : 'bottom'}>
                    <button
                      type="button"
                      className={
                        `flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? action.activeClassName ?? activeClass
                            : 'text-darkBlueGray-400 hover:text-white hover:bg-darkBlueGray-700/50 active:bg-darkBlueGray-600/50 hover:shadow-md'
                        } ${action.className ?? ''}`
                      }
                      aria-label={action.tooltip ?? action.key.toString()}
                      onClick={() => {
                        if (!action.independent)
                          setSelectedKey(action.key)
                        action.onClick?.()
                        if (!action.independent)
                          onChange?.(action.key)
                      }}
                    >
                      {action.icon}
                    </button>
                  </Tooltip>
                )
              }

              if (action.type === 'divider') {
                return (
                  <div
                    className={
                      cs('bg-darkBlueGray-600/30', direction === 'horizontal' ? 'h-11 w-px mx-2' : 'w-11 h-px my-2')
                    }
                    key={action.key}
                  />
                )
              }

              return null
            })
          }

        </div>
      </div>
    </div>
  )
}

export default PreSelectSideBar
