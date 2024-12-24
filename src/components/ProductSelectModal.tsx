import { Checkbox, Form, Modal, Space } from 'antd'

interface ProductSelectModalProps {
  open: boolean
  products: { id: number, name: string }[]
}

export function ProductSelectModal(props: ProductSelectModalProps) {
  const { open } = props

  return (
    <Modal width={450} open={open} centered zIndex={2000}>
      <Space direction="vertical">
        <div className="text-xl font-bold">请选择要制作的产品</div>
        <p className="text-sm text-black-secondText">您可以选择多个产品来制作，选择完成后点击确认。</p>
      </Space>
      <Form layout="vertical" className="mt-4">
        {
          props.products.map(product => (
            <Form.Item key={product.id} className="mb-0">
              <Checkbox>{product.name}</Checkbox>
            </Form.Item>
          ))
        }
      </Form>
    </Modal>
  )
}
