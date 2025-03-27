import type { FC, MouseEvent, ReactElement } from 'react'
import { Tooltip } from 'antd'
import cs from 'classnames'

interface ToolBtnProps {
  icon: ReactElement
  disabled?: boolean
  desc?: string
  onClick?: (e: MouseEvent) => void
}

const ToolBtn: FC<ToolBtnProps> = ({ icon, desc, onClick, disabled = false }) => {
  return (
    <Tooltip title={desc}>
      <div
        className={
          cs(
            'flex justify-center items-center w-9 h-9 rounded-full bg-darkBlueGray-700 transition-all ease-in-out text-text-onDark',
            disabled ? 'bg-darkBlueGray-800 cursor-not-allowed' : ' hover:bg-darkBlueGray-600 cursor-pointer',
          )
        }
        onClick={onClick}
      >
        { icon }
      </div>
    </Tooltip>
  )
}

export default ToolBtn
