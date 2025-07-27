import type { DropdownProps } from 'antd/lib'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { DownOutlined, LeftOutlined, MessageOutlined, PlusOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Form, Input, Space } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { type RefObject, useEffect, useState } from 'react'
import { usePhotosStore } from '../../stores/usePhotosStore'

interface ViewerControlProps {
  // 用于控制缩放的引用
  transformRef?: RefObject<ReactZoomPanPinchRef>
}

export function ViewerControl({ transformRef }: ViewerControlProps) {
  const [open, setOpen] = useState(false)
  const [remarkModalVisible, setRemarkModalVisible] = useState(false)
  const { viewerControlVisible, setKeyboardDisabled } = usePhotoViewerContext()
  const { next, previous, rotateLeft, rotateRight } = usePhotoViewerStore()
  const { productMenu, dropdownMenuClick } = useProductsStore()
  const { currentPhoto, setPhotoRemark } = usePhotosStore()
  const [form] = Form.useForm()

  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen)
    }
  }

  // 处理备注按钮点击事件
  const handleRemark = () => {
    setKeyboardDisabled(true)
    setRemarkModalVisible(true)
  }

  // 保存备注
  const handleSaveRemark = () => {
    const values = form.getFieldValue('remark')
    setPhotoRemark(values)
    setRemarkModalVisible(false)
    setKeyboardDisabled(false)
  }

  const zoomIn = () => transformRef?.current?.zoomIn()
  const zoomOut = () => transformRef?.current?.zoomOut()

  useEffect(() => {
    if (currentPhoto && remarkModalVisible) {
      form.setFieldsValue({ remark: currentPhoto.remark })
    }
  }, [currentPhoto, form, remarkModalVisible])

  return (
    <>
      <AnimatePresence>
        {
          viewerControlVisible
          && (
            <motion.div
              key="viewer-control"
              initial={{ opacity: 0 }}
              animate={{ opacity: viewerControlVisible ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 顶部控制栏 */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 rounded-xl p-2 bg-darkBlueGray-900/80 shadow-lg z-50">
                <Space>
                  <Dropdown open={open} menu={{ items: productMenu, onClick: dropdownMenuClick }} onOpenChange={handleOpenChange}>
                    <Button icon={<PlusOutlined />}>
                      加入产品
                      <DownOutlined />
                    </Button>

                  </Dropdown>
                  <Divider type="vertical" className="border-darkBlueGray-600 h-6 w-1 mx-1" />
                  {/* <Button icon={<HeartOutlined />} /> */}
                  <Button icon={<MessageOutlined />} onClick={handleRemark} />
                  <Divider type="vertical" className="border-darkBlueGray-600 h-6 w-1 mx-1" />
                  <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
                  <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
                  <Button icon={<RotateLeftOutlined />} onClick={() => rotateLeft()} />
                  <Button icon={<RotateRightOutlined />} onClick={() => rotateRight()} />
                </Space>
              </div>

              {/* 左右翻页按钮 */}
              <div
                onClick={() => previous()}
                className="absolute z-50 left-8 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-900/80 hover:bg-darkBlueGray-700 active:bg-darkBlueGray-900 flex items-center justify-center cursor-pointer"
              >
                <LeftOutlined className="text-darkBlueGray-100" />
              </div>

              <div
                onClick={() => next()}
                className="absolute z-50 right-8 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-900/80 hover:bg-darkBlueGray-700 active:bg-darkBlueGray-900 flex items-center justify-center cursor-pointer"
              >
                <RightOutlined className="text-darkBlueGray-100" />
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>

      {/* 备注弹框 */}
      <CustomModal
        open={remarkModalVisible}
        title={`为照片「${currentPhoto?.name ?? ''}」添加备注`}
        okText="保存"
        centered
        onOk={handleSaveRemark}
        onCancel={() => {
          setRemarkModalVisible(false)
          setKeyboardDisabled(false)
          form.resetFields()
        }}
      >
        <Form form={form}>
          <Form.Item name="remark">
            <Input.TextArea
              placeholder="请输入备注内容"
              rows={3}
              classNames={{
                textarea: 'bg-darkBlueGray-700 border-darkBlueGray-600 placeholder:text-darkBlueGray-100 hover:border-darkBlueGray-400 hover:bg-darkBlueGray-600 focus:bg-darkBlueGray-600 focus:border-darkBlueGray-400/50 focus:darkBlueGray-400/50',
              }}
            />
          </Form.Item>
        </Form>
      </CustomModal>
    </>
  )
}
