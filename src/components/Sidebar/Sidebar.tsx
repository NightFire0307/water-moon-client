import type { FC, MouseEvent } from 'react'
import ProductCardGroup from '@/components/Sidebar/ProductCardGroup.tsx'
import SidebarBtn from '@/components/Sidebar/SidebarBtn.tsx'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface SidebarProps {
  collapsed: boolean
  maxSelectPhotos?: number
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const Sidebar: FC<SidebarProps> = ({ collapsed, onClick, maxSelectPhotos }) => {
  return (
    <>
      <div className="flex justify-between  items-center mb-4">
        {
          !collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
              <div className="text-xl font-bold text-darkBlueGray-800">产品列表</div>
            </div>
          )
        }
        <Button
          type="text"
          block
          className="max-w-[50px]"
          icon={!collapsed ? <LeftOutlined className="text-darkBlueGray-900" /> : <RightOutlined className="text-darkBlueGray-900" />}
          onClick={onClick && onClick}
        >
        </Button>
      </div>
      {
        !collapsed
          ? <ProductCardGroup maxSelectPhotos={maxSelectPhotos ?? 0} />
          : <SidebarBtn />
      }
    </>
  )
}

export default Sidebar
