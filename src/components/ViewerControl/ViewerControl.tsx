import type { DropdownProps } from 'antd/lib'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { DownOutlined, LeftOutlined, LogoutOutlined, MessageOutlined, PlusOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Form, Input, Space } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { type RefObject, useState } from 'react'

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

  const zoomIn = () => transformRef?.current?.zoomIn()
  const zoomOut = () => transformRef?.current?.zoomOut()

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
              <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-2 bg-darkBlueGray-800/60 z-50">
                <Space>
                  <Dropdown open={open} menu={{ items: productMenu, onClick: dropdownMenuClick }} onOpenChange={handleOpenChange}>
                    <Button icon={<PlusOutlined />}>
                      加入产品
                      <DownOutlined />
                    </Button>

                  </Dropdown>
                  <Divider type="vertical" className="border-darkBlueGray-800/30 h-6 w-1 mx-1" />
                  {/* <Button icon={<HeartOutlined />} /> */}
                  <Button icon={<MessageOutlined />} onClick={handleRemark} />
                  <Divider type="vertical" className="border-darkBlueGray-800/30 h-6 w-1 mx-1" />
                  <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
                  <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
                  <Button icon={<RotateLeftOutlined />} onClick={() => rotateLeft()} />
                  <Button icon={<RotateRightOutlined />} onClick={() => rotateRight()} />
                </Space>
              </div>

              {/* 退出选片 */}
              <div className="absolute top-6 right-4 z-50">
                <Button icon={<LogoutOutlined />} />
              </div>

              {/* 左右翻页按钮 */}
              <div
                onClick={() => previous()}
                className="absolute z-50 left-4 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-800 hover:bg-darkBlueGray-700 active:bg-darkBlueGray-900 flex items-center justify-center cursor-pointer"
              >
                <LeftOutlined className="text-darkBlueGray-100" />
              </div>

              <div
                onClick={() => next()}
                className="absolute z-50 right-4 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-800 hover:bg-darkBlueGray-700 active:bg-darkBlueGray-900 flex items-center justify-center cursor-pointer"
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
        title="添加照片备注"
        okText="保存"
        centered
        onCancel={() => {
          setRemarkModalVisible(false)
          setKeyboardDisabled(false)
        }}
      >
        <Form>
          <Form.Item name="remark">
            <Input.TextArea placeholder="请输入备注内容" rows={3} />
          </Form.Item>
        </Form>
      </CustomModal>
    </>
  )
}
