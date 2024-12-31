import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
import { usePhotosStore } from '../stores/photosStore.tsx'

export interface RemarkModalProps {
  photoId: number
  open: boolean
  onClose: () => void
  onSave: (remark: string) => void
}

export function RemarkModal(props: RemarkModalProps) {
  const { photoId, open, onClose, onSave } = props
  const [form] = useForm()
  const photos = usePhotosStore(state => state.photos)

  function handleOk() {
    const remark = form.getFieldValue('remark')
    onSave(remark)
    onClose()
  }

  useEffect(() => {
    if (!open)
      return
    // 获取图片备注
    const photo = photos.find(photo => photo.photoId === photoId)
    if (photo) {
      form.setFieldsValue({
        remark: photo.remark,
      })
    }

    return () => form.resetFields()
  }, [open, photoId])

  return (
    <Modal
      centered
      open={open}
      title="添加备注"
      okText="保存"
      onOk={handleOk}
      onCancel={onClose}
      zIndex={2000}
    >
      <Form form={form}>
        <Form.Item name="remark">
          <Input.TextArea
            placeholder="请输入备注"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
