import type { FC } from 'react'
import DetailItem from '@/components/Navbar/DetailItem.tsx'
import { CalendarOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons'
import { animated } from '@react-spring/web'

const NavbarExpand: FC = () => {
  return (
    <animated.div className="flex gap-16 justify-start items-center pl-4 pr-4 w-full h-[65px] bg-darkBlueGray-50 shadow-md rounded-br-xl rounded-bl-xl">
      <DetailItem title="套餐类型" desc="豪华套餐" icon={<HeartOutlined />} />
      <DetailItem title="摄影师" desc="王小二" icon={<UserOutlined />} />
      <DetailItem
        title="已选 / 总数 (精修)"
        desc={(
          <div>
            <span>32</span>
            {' / '}
            <span className="text-darkBlueGray-500">64</span>
          </div>
        )}
        icon={<HeartOutlined />}
      />
      <DetailItem title="拍摄张数" desc="350" icon={<HeartOutlined />} />
      <DetailItem title="拍摄日期" desc="2025年3月22日" icon={<CalendarOutlined />} />
    </animated.div>
  )
}

export default NavbarExpand
