import type { FC } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { MessageOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'

interface PhotoRemarkModalProps {
  open: boolean
  onClose?: () => void
}

const PhotoRemarkModal: FC<PhotoRemarkModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    console.log(values)
  }

  const handleCancel = () => {
    form.resetFields()
    onClose && onClose()
  }

  return (
    <CustomModal
      open={open}
      title="照片备注"
      desc="为照片 IMG_0001 添加备注信息"
      icon={<MessageOutlined />}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <Form form={form} className="mt-6 ">
        <Form.Item name="remark">
          <Input.TextArea
            autoSize={{ minRows: 4 }}
            placeholder="请输入照片备注信息..."
            classNames={{
              textarea: 'bg-darkBlueGray-600 text-darkBlueGray-300 placeholder:text-darkBlueGray-300 border-darkBlueGray-700 hover:border-darkBlueGray-600 hover:bg-darkBlueGray-700',
            }}
          />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}

export default PhotoRemarkModal
