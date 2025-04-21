import type { FC } from 'react'
import { PackageIcon } from '@/assets/icon'
import DetailItem from '@/components/Navbar/DetailItem.tsx'
import { useOrderInfoContext } from '@/contexts/OrderInfoContext'
import { CalendarOutlined, HeartOutlined, PayCircleOutlined, UserOutlined } from '@ant-design/icons'

const NavbarExpand: FC = () => {
  const { total_photos, max_select_photos, extra_photo_price } = useOrderInfoContext()

  return (
    <div className="flex gap-16 justify-start items-center pl-4 pr-4 w-full h-[65px] bg-darkBlueGray-50 shadow-md rounded-br-xl rounded-bl-xl">
      <DetailItem title="套餐类型" desc="豪华套餐" icon={<PackageIcon />} />
      <DetailItem title="摄影师" desc="王小二" icon={<UserOutlined />} />
      <DetailItem
        title="已选 / 总数 (精修)"
        desc={(
          <div>
            <span>32</span>
            {' / '}
            <span className="text-darkBlueGray-500">{max_select_photos}</span>
          </div>
        )}
        icon={<HeartOutlined />}
      />
      <DetailItem
        title="超选单价 (元 / 张)"
        desc={`￥${extra_photo_price}`}
        icon={<PayCircleOutlined />}
      />
      <DetailItem title="拍摄张数" desc={total_photos} icon={<HeartOutlined />} />
      <DetailItem title="拍摄日期" desc="2025年3月22日" icon={<CalendarOutlined />} />
    </div>
  )
}

export default NavbarExpand
