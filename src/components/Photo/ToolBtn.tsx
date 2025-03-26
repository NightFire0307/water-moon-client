import type { FC, MouseEvent, ReactElement } from 'react'
import { Tooltip } from 'antd'

interface ToolBtnProps {
  icon: ReactElement
  desc?: string
  onClick?: (e: MouseEvent) => void
}

const ToolBtn: FC<ToolBtnProps> = ({ icon, desc, onClick }) => {
  return (
    <Tooltip title={desc}>
      <div
        className="flex justify-center items-center w-9 h-9 rounded-full bg-darkBlueGray-700 hover:bg-darkBlueGray-600 transition duration-150
         ease-in-out  cursor-pointer text-text-onDark"
        onClick={onClick}
      >
        { icon }
      </div>
    </Tooltip>
  )
}

export default ToolBtn
