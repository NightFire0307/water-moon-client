import type { FC, MouseEvent, ReactElement } from 'react'
import { Tooltip } from 'antd'
import cs from 'classnames'

interface ToolBtnProps {
  icon: ReactElement
  disabled?: boolean
  desc?: string
  onClick?: (e: MouseEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
}

const ToolBtn: FC<ToolBtnProps> = ({ icon, desc, onClick, onFocus, onMouseEnter, onMouseLeave, disabled = false }) => {
  return (
    <Tooltip title={desc}>
      <div
        className={
          cs(
            'flex justify-center items-center w-8 h-8 rounded-full bg-darkBlueGray-700 transition-all ease-in-out ',
            disabled ? 'text-darkBlueGray-500 bg-darkBlueGray-800 cursor-not-allowed' : ' hover:bg-darkBlueGray-600 cursor-pointer text-darkBlueGray-200',
          )
        }
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
      >
        { icon }
      </div>
    </Tooltip>
  )
}

export default ToolBtn
