import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Flex, Result, Space } from 'antd'
import { BoxVariantIconIcon } from '../../../assets/svg/CustomIcon.tsx'
import { useProductsStore } from '../../../stores/productsStore.tsx'

interface ValidationResultProps {
  allSelect: boolean
}

export function ValidationResult(props: ValidationResultProps) {
  const { allSelect } = props
  const products = useProductsStore(state => state.products)

  return (
    <>
      {
        allSelect
          ? (
              <Result
                status="success"
                title="所有产品选片校验成功"
                subTitle={<div className="font-bold text-[#f5222d]">注：提交选片结果后将无法更改，是否确认提交？</div>}
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
                    products.map(product => (
                      <Alert
                        key={product.productId}
                        type={product.selected.length > product.total ? 'warning' : product.total === product.selected.length ? 'success' : 'error'}
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
                              {
                                product.selected.length > product.total
                                  ? (
                                      <InfoCircleOutlined className="text-xl text-[#faad14]" />
                                    )
                                  : product.total === product.selected.length
                                    ? (
                                        <CheckCircleOutlined className="text-xl text-[#52c41a]" />
                                      )
                                    : (
                                        <CloseCircleOutlined className="text-xl text-[#f5222d]" />
                                      )
                              }
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
