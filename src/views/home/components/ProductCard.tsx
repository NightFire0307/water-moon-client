import type { FC } from 'react'
import { Card, Progress, Tooltip, Typography } from 'antd'
import { CameraIcon, CircleCheckBoxIcon, WarningIcon } from '../../../assets/svg/CustomIcon.tsx'

const { Text } = Typography

interface ProductCardProps {
  // 产品ID
  productId: number
  // 产品标题
  title: string
  // 产品数量
  count: number
  // 已选张数
  selectedCount: number
  // 照片数量限制
  photoLimit: number
  // 产品类型
  type: string
  onClick?: (productId: number) => void
}

interface ProductTitleProps {
  title: string
  count: number
}

const ProductTitle: FC<ProductTitleProps> = ({ title, count }) => {
  return (
    <div className="flex items-center justify-between">
      <div>{title}</div>
      <div className="text-[12px]">
        数量:
        {' '}
        {count}
      </div>
    </div>
  )
}

export function ProductCard(props: ProductCardProps) {
  const { productId, title, count, selectedCount, photoLimit, type, onClick } = props

  function handleCardClick() {
    onClick && onClick(productId)
  }

  return (
    <Card
      size="small"
      variant="borderless"
      className="w-full"
      title={<ProductTitle title={title} count={count} />}
      styles={{
        header: { background: '#1e293b', color: '#fff' },
      }}
      hoverable
      onClick={handleCardClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="pl-2 pr-2 rounded-full inline-block bg-daybreakBlue-100 text-black-firstText text-[12px]">{ type }</div>
          {
            selectedCount === photoLimit ? <CircleCheckBoxIcon className="text-xl" /> : null
          }
          {
            selectedCount > photoLimit
              ? (
                  <Tooltip title="超出规定张数">
                    <span>
                      <WarningIcon className="text-xl text-[#fadb14]" />
                    </span>
                  </Tooltip>
                )
              : null
          }
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-geekBlue-200 w-6 h-6 rounded-full flex justify-center items-center">
              <CameraIcon className="text-geekBlue-800 w-4" />
            </div>
            <Text className="text-black-secondText text-[12px]">应选 / 实选</Text>
          </div>

          <Text
            className="text-black-secondText font-semibold "
          >
            {photoLimit}
            {' '}
            /
            {' '}
            <span className={selectedCount < photoLimit ? 'text-[#f5222d]' : 'text-[#52c41a]'}>
              {selectedCount}
            </span>
          </Text>
        </div>

        <div>
          <div className="flex justify-between">
            <div className="text-[12px]">完成进度</div>
            <div>
              {(selectedCount / photoLimit) * 100 > 100 ? 100 : (selectedCount / photoLimit) * 100 }
              %
            </div>
          </div>
          <Progress showInfo={false} percent={(selectedCount / photoLimit) * 100} />
        </div>
      </div>
    </Card>
  )
}
