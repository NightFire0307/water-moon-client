import type { FC } from 'react'
import { CameraIcon, CircleCheckIcon, WarningIcon } from '@/assets/icon'
import { Card, Progress, Tooltip, Typography } from 'antd'
import cs from 'classnames'

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
  className?: string
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
        <div className="inline-flex justify-center items-center w-5 h-5 rounded bg-darkBlueGray-600">
          {count}
        </div>
      </div>
    </div>
  )
}

export function ProductCard(props: ProductCardProps) {
  const { productId, title, count, selectedCount, photoLimit, type, onClick, className } = props

  function handleCardClick() {
    onClick && onClick(productId)
  }

  return (
    <Card
      size="small"
      variant="borderless"
      className={cs('w-full cursor-pointer transition duration-150 ease-in-out hover:shadow-lg', className)}
      title={<ProductTitle title={title} count={count} />}
      styles={{
        header: { background: 'linear-gradient(90deg, #1e293b, #324054)', color: '#fff' },
        body: { background: '#f9fbfd' },
      }}
      onClick={handleCardClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="pl-2 pr-2 rounded-full inline-block bg-darkBlueGray-200 text-black-firstText text-[12px]">{ type }</div>
          {
            selectedCount === photoLimit ? <CircleCheckIcon className="text-base text-emerald-600" /> : null
          }
          {
            selectedCount > photoLimit
              ? (
                  <Tooltip title="超出规定张数">
                    <span>
                      <WarningIcon className="text-base text-amber-600" />
                    </span>
                  </Tooltip>
                )
              : null
          }
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-darkBlueGray-200 w-6 h-6 rounded-full flex justify-center items-center">
              <CameraIcon className="text-darkBlueGray-1000 text-base" />
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
            <span className={selectedCount < photoLimit ? 'text-amber-600' : 'text-emerald-600'}>
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
          <Progress
            showInfo={false}
            percent={(selectedCount / photoLimit) * 100}
            strokeColor={(selectedCount / photoLimit) * 100 < 100 ? '#475569' : '#10b981'}
          />
        </div>
      </div>
    </Card>
  )
}
