import type { FC } from 'react'
import { getPhotoRemarkById, updatePhotoRemark } from '@/apis/order.ts'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotosStore } from '@/stores/photosStore.tsx'
import { MessageOutlined } from '@ant-design/icons'
import { Form, Input, message } from 'antd'
import { useEffect } from 'react'

interface PhotoRemarkModalProps {
  open: boolean
  photoId: number
  photoName: string
  onClose?: () => void
}

const PhotoRemarkModal: FC<PhotoRemarkModalProps> = ({ open, photoId, photoName, onClose }) => {
  const [form] = Form.useForm()
  const updatePhotoRemarkStore = usePhotosStore(state => state.updatePhotoRemark)

  const handleCancel = () => {
    form.resetFields()
    onClose && onClose()
  }

  const handleOk = async () => {
    const { remark } = form.getFieldsValue()
    updatePhotoRemarkStore(photoId, remark)
    const { msg } = await updatePhotoRemark({ photoId, remark })
    message.success(msg)
    handleCancel()
  }

  useEffect(() => {
    if (open && photoId) {
      getPhotoRemarkById(photoId)
        .then(({ data }) => {
          form.setFieldValue('remark', data.remark)
        })
    }
  }, [photoId, open])

  return (
    <CustomModal
      open={open}
      title="照片备注"
      desc={`为照片 IMG_${photoName} 添加备注信息`}
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
