import { Card, Progress, Typography } from 'antd'

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
      <div className="flex justify-between">
        <Text>{title}</Text>
        <Text
          className="text-black-secondText font-bold"
        >
          {selected}
          /
          {total}
        </Text>
      </div>
      <Progress showInfo={false} percent={(selected / total) * 100} />
    </Card>
  )
}
