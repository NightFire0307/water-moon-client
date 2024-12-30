import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button, ConfigProvider, Flex, Modal, Space } from 'antd'
import { useState } from 'react'
import { BoxVariantIconIcon } from '../../../assets/svg/CustomIcon.tsx'
import { useProductsStore } from '../../../stores/productsStore.tsx'

interface ConfirmModalProps {
  open: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { open, onCancel, onSubmit } = props
  const [allCheck, setAllCheck] = useState(true)
  const products = useProductsStore(state => state.products)

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            headerBg: '#e6f4ff',
            contentBg: '#e6f4ff',
          },
        },
      }}
    >
      <Modal
        styles={{
          content: { padding: '0px' },
        }}
        footer={null}
        open={open}
        onCancel={onCancel}
      >
        <div className="w-full text-center text-2xl pt-4 font-bold text-[#002c8c]">确认提交</div>
        {/* <p className="text-[red] font-bold">提交选片结果后将无法更改，是否确认提交？</p> */}
        <div className="p-6">
          <div className="text-xl font-semibold mt-4 text-black-firstText">产品选片校验结果</div>
          <Space direction="vertical" className="w-full text-base mt-4 max-h-[400px] overflow-hidden overflow-y-auto">
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
        </div>

        <div className="bg-white flex gap-4 justify-end p-6 rounded-b-2xl">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" disabled={allCheck}>确认提交</Button>
        </div>
      </Modal>
    </ConfigProvider>
  )
}
