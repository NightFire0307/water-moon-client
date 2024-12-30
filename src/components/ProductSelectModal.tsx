import { Checkbox, Form, Modal, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import { useProductsStore } from '../stores/productsStore.tsx'

interface ProductSelectModalProps {
  photoId: number
  open: boolean
  onSubmit: (productIds: number[]) => void
  onClose: () => void
}

export function ProductSelectModal(props: ProductSelectModalProps) {
  const { photoId, open, onClose, onSubmit } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = useForm()
  const products = useProductsStore(state => state.products)
  const updateProductSelected = useProductsStore(state => state.updateProductSelected)

  function handleOk() {
    setConfirmLoading(true)
    const { productIds } = form.getFieldsValue()
    updateProductSelected(productIds, photoId)
    setConfirmLoading(false)
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      width={450}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      centered
      zIndex={2000}
    >
      <Space direction="vertical">
        <div className="text-xl font-bold">请选择要制作的产品</div>
        <p className="text-sm text-black-secondText">您可以选择多个产品来制作，选择完成后点击确认。</p>
      </Space>
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="productIds" className="mb-0">
          <Checkbox.Group>
            {
              products.map(product => (
                <Checkbox value={product.productId} key={product.productId}>{product.title}</Checkbox>
              ))
            }
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
