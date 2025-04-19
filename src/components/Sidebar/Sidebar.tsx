import type { FC, MouseEvent } from 'react'
import ProductCardGroup from '@/components/Sidebar/ProductCardGroup.tsx'
import SidebarBtn from '@/components/Sidebar/SidebarBtn.tsx'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import cs from 'classnames'

interface SidebarProps {
  collapsed: boolean
  maxSelectPhotos?: number
  onClick?: (e: MouseEvent) => void
}

const Sidebar: FC<SidebarProps> = ({ collapsed, onClick, maxSelectPhotos }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className={cs('flex items-center mb-4', collapsed ? 'justify-center' : 'justify-between')}>
        {
          !collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
              <div className="text-xl font-bold text-darkBlueGray-800">产品列表</div>
            </div>
          )
        }
        <div
          className={cs('w-10 h-10 flex justify-center items-center rounded-md  hover:cursor-pointer', !collapsed ? 'hover:bg-darkBlueGray-200' : 'hover:bg-darkBlueGray-700')}
          onClick={onClick}
        >
          {!collapsed ? <LeftOutlined className="text-darkBlueGray-900" /> : <RightOutlined className="text-darkBlueGray-400" />}
        </div>
      </div>
      {
        !collapsed
          ? <ProductCardGroup maxSelectPhotos={maxSelectPhotos ?? 0} />
          : <SidebarBtn />
      }
    </div>
  )
}

export default Sidebar
