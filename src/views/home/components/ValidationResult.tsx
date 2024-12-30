import type { IProduct } from '../../../stores/productsStore.tsx'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Alert, Flex, Result, Space } from 'antd'
import { useEffect, useState } from 'react'
import { BoxVariantIconIcon } from '../../../assets/svg/CustomIcon.tsx'
import { useProductsStore } from '../../../stores/productsStore.tsx'

interface ValidationResultProps {
  allSelect: boolean
}

export function ValidationResult(props: ValidationResultProps) {
  const { allSelect } = props
  // 校验失败的产品列表
  const [failedProducts, setFailedProducts] = useState<IProduct[]>([])

  // 超过指定数量的产品列表
  const [overLimitProducts, setOverLimitProducts] = useState<IProduct[]>([])
  const products = useProductsStore(state => state.products)

  useEffect(() => {
    const failed = products.filter(product => product.selected.length < product.total)
    setFailedProducts(failed)
  }, [products])

  useEffect(() => {
    const overLimit = products.filter(product => product.selected.length > product.total)
    setOverLimitProducts(overLimit)
  }, [products])

  return (
    <>
      {
        allSelect
          ? (
              <Result
                status={overLimitProducts.length > 0 ? 'warning' : 'success'}
                title="所有产品选片校验成功"
                subTitle={<div className="font-bold text-[#f5222d]">注：提交选片结果后将无法更改，是否确认提交？</div>}
                extra={overLimitProducts.length > 0 && (
                  <Alert
                    type="warning"
                    message={(
                      <>
                        <div>当前有以下产品超过指定选片数量</div>
                        {
                          overLimitProducts.map(product => (
                            <div key={product.productId}>
                              {product.title}
                              ：应选
                              {product.total}
                              张 / 实选
                              {product.selected.length}
                              张
                            </div>
                          ))
                        }
                      </>
                    )}
                  />
                )}
              />
            )
          : (
              <>
                <div className="text-xl font-semibold mt-4 text-black-firstText">选片校验结果失败</div>
                <Space
                  direction="vertical"
                  className="w-full text-base mt-4 max-h-[400px] overflow-hidden overflow-y-auto"
                >
                  {
                    failedProducts.map(product => (
                      <Alert
                        key={product.productId}
                        type="error"
                        message={(
                          <Flex justify="space-between" className="m-2">
                            <div className="flex gap-2">
                              <BoxVariantIconIcon className="text-base" />
                              <div className="font-semibold">
                                {product.title}
                              </div>
                            </div>
                            <Flex gap={8}>
                              <div>
                                应选：
                                {product.total}
                                张 / 实选：
                                {product.selected.length}
                                张
                              </div>
                              <CloseCircleOutlined className="text-xl text-[#f5222d]" />
                            </Flex>
                          </Flex>
                        )}
                      >
                      </Alert>
                    ))
                  }
                </Space>
              </>
            )
      }
    </>
  )
}
