import { Card, Progress, Tooltip, Typography } from 'antd'
import { BoxVariantIconIcon, CircleCheckBoxIcon, WarningIcon } from '../assets/svg/CustomIcon.tsx'

const { Text } = Typography

interface ProductCardProps {
  productId: number
  title: string
  // 应选张数
  total: number
  // 已选张数
  selected: number
}

export function ProductCard(props: ProductCardProps) {
  const { productId, title, total, selected } = props

  function handleCardClick() {
    console.log(productId)
  }

  return (
    <Card
      size="small"
      bordered={false}
      className="w-full"
      hoverable
      onClick={handleCardClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="bg-black-title w-[30px] h-[30px] bg-geekBlue-200 rounded-[50%] flex justify-center items-center mr-2">
            <BoxVariantIconIcon className="text-xl text-geekBlue-600" />
          </div>
          <div>{title}</div>
        </div>
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
      <div className="flex justify-between mt-4">
        <Text className="text-black-secondText font-medium">已选照片</Text>
        <Text
          className="text-black-secondText font-semibold "
        >
          {selected}
          {' '}
          /
          {' '}
          {total}
        </Text>
      </div>
      <Progress showInfo={false} percent={(selected / total) * 100} strokeColor={selected > total ? '#fadb14' : '#597ef7'} />

      <div className="flex justify-between mt-2 text-xs text-black-secondText font-medium">
        <div>
          应选：
          {' '}
          { total }
          {' '}
          张
        </div>
        <div>
          实选：
          {' '}
          { selected }
          {' '}
          张
        </div>
      </div>
    </Card>
  )
}
