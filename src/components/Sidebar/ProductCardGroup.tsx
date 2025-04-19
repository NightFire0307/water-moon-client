import type { FC } from 'react'
import CustomCard from '@/components/CustomCard/CustomCard.tsx'
import { ProductCard } from '@/components/Sidebar/ProductCard.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { animated, useTrail } from '@react-spring/web'
import { Space } from 'antd'
import cs from 'classnames'
import { useEffect, useState } from 'react'

interface ProductCardGroupProps {
  maxSelectPhotos: number
  onChange?: (productId: number) => void
}

const ProductCardGroup: FC<ProductCardGroupProps> = ({ maxSelectPhotos = 0, onChange }) => {
  const products = useProductsStore(state => state.products)
  const [curIndex, setCurIndex] = useState(-1)
  const filterPhotoByProductId = usePhotosStore(state => state.filterPhotoByProductId)
  const clearFilterPhotos = usePhotosStore(state => state.clearFilterPhotos)

  const [trail, api] = useTrail(
    products.length,
    () => ({
      from: { opacity: 0 },
      config: {
        duration: 150,
      },
    }),
  )

  function handleCardClick(index: number, productId?: number) {
    setCurIndex(index)

    if (productId) {
      onChange && onChange(productId)

      filterPhotoByProductId(productId)
    }
    else {
      clearFilterPhotos()
    }
  }

  useEffect(() => {
    api.start({ opacity: 1 })
  }, [products])

  return (
    <div className="flex justify-center">
      <Space direction="vertical" size="middle" className="w-full">
        <CustomCard
          title="全部照片"
          className={
            cs(' p-0.5 border-2 border-current rounded-xl transition duration-300 ease-in-out', curIndex === -1 && 'border-darkBlueGray-600')
          }
          onClick={() => handleCardClick(-1)}
        >
          <div className="flex justify-between text-xs">
            <div className="pl-2 pr-2 rounded-full inline-block bg-darkBlueGray-200 text-black-firstText ">所有类型</div>
            <p className="text-darkBlueGray-500">查看全部照片</p>
          </div>
        </CustomCard>
        {
          trail.map((style, index) => (
            <animated.div key={products[index].productId} style={style}>
              <ProductCard
                productId={products[index].productId}
                title={products[index].title}
                selectedCount={products[index].selected_photos.length}
                count={products[index].count}
                photoLimit={products[index].photo_limit !== 0 ? products[index].photo_limit * products[index].count : maxSelectPhotos}
                type={products[index].product_type}
                onClick={productId => handleCardClick(index, productId)}
                className={
                  cs(' p-0.5 border-2 border-current rounded-xl transition duration-300 ease-in-out', curIndex === index && 'border-darkBlueGray-600')
                }
              />
            </animated.div>
          ))
        }
      </Space>
    </div>
  )
}

export default ProductCardGroup
