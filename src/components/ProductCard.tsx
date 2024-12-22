import { Card } from 'antd'

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
      title={title}
      size="small"
      bordered={false}
      className="w-[250px]"
    >
      <div>
        应选张数：
        <span className="text-black-secondText font-bold">
          {total}
          张
        </span>
      </div>
      <div>
        已选张数：
        <span className="text-black-secondText font-bold">
          {selected}
          张
        </span>
      </div>
    </Card>
  )
}
