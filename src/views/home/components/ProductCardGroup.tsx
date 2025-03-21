import type { FC } from 'react'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { ProductCard } from '@/views/home/components/ProductCard.tsx'
import { animated, useTrail } from '@react-spring/web'
import { Space } from 'antd'
import cs from 'classnames'
import { useEffect, useState } from 'react'

interface ProductCardGroupProps {
  maxSelectPhotos: number
  onChange?: (productId: number) => void
}

export const ProductCardGroup: FC<ProductCardGroupProps> = ({ maxSelectPhotos = 0, onChange }) => {
  const products = useProductsStore(state => state.products)
  const [curIndex, setCurIndex] = useState(-1)

  const [trail, api] = useTrail(
    products.length,
    () => ({ from: { opacity: 0, scale: 0.5 } }),
  )

  function handleCardClick(index: number, productId: number) {
    setCurIndex(index)
    onChange && onChange(productId)
  }

  useEffect(() => {
    api.start({ opacity: 1, scale: 1 })
  }, [products])

  return (
    <div className="flex justify-center">
      <Space direction="vertical" size="middle" className="w-full">
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
                onClick={() => handleCardClick(index, products[index].productId)}
                className={
                  cs('p-0.5 border-2 border-current rounded-xl transition duration-300 ease-in-out', curIndex === index && 'border-darkBlueGray-600')
                }
              />
            </animated.div>
          ))
        }
      </Space>
    </div>
  )
}
