import { Card, Progress, Space, Tooltip, Typography } from 'antd'
import { CircleCheckBoxIcon, WarningIcon } from '../assets/svg/CustomIcon.tsx'

const { Text } = Typography

interface ProductCardProps {
  title: string
  // 应选张数
  total: number
  // 已选张数
  selected: number
}

export function ProductCard(props: ProductCardProps) {
  const { title, total, selected } = props

  return (
    <Card
      size="small"
      bordered={false}
      className="w-[250px]"
      hoverable
    >
      <Space direction="vertical" className="w-full">
        <div className=" flex justify-between">
          <Text>{title}</Text>
          {
            selected === total ? <CircleCheckBoxIcon className="text-xl" /> : null
          }
          {
            selected > total
              ? (
                  <Tooltip title="超出限定张数">
                    <WarningIcon className="text-xl text-[#fadb14]" />
                  </Tooltip>
                )
              : null
          }
        </div>
        <div className="flex justify-between">
          <Text className="text-black-secondText">已选照片</Text>
          <Text
            className="text-black-firstText font-semibold "
          >
            {selected}
            {' '}
            /
            {' '}
            {total}
          </Text>
        </div>
        <Progress showInfo={false} percent={(selected / total) * 100} strokeColor={selected > total ? '#fadb14' : ''} />
      </Space>
    </Card>
  )
}
