import type { DropdownProps } from 'antd/lib'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { CheckOutlined, DownOutlined, LeftOutlined, MessageOutlined, PlusOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Dropdown, Form, Input, type MenuProps } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { type RefObject, useEffect, useMemo, useState } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'
import { usePhotosStore } from '../../stores/usePhotosStore'

interface ViewerControlProps {
  next?: () => void // 用于翻到下一张照片
  previous?: () => void // 用于翻到上一张照片
  // 用于控制缩放的引用
  transformRef?: RefObject<ReactZoomPanPinchRef>
}

export function ViewerControl({ transformRef, next, previous }: ViewerControlProps) {
  const [open, setOpen] = useState(false)
  const [remarkModalVisible, setRemarkModalVisible] = useState(false)
  const { viewerControlVisible, setKeyboardDisabled } = usePhotoViewerContext()
  const { rotateLeft, rotateRight } = usePhotoViewerStore()
  const { productMenu, dropdownMenuClick } = useProductsStore()
  const { currentPhoto, setPhotoRemark } = usePhotosStore()
  const [form] = Form.useForm()

  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen)
    }
  }

  const menuItems: MenuProps['items'] = useMemo(() => {
    return productMenu.map(item => ({
      key: item.key,
      label: item.label,
      icon: item.isSelected ? <CheckOutlined /> : undefined, // 如果是选中状态，显示勾选图标
      extra: item.extra,
    }))
  }, [productMenu])

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
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-gradient-to-r from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-600/30 rounded-2xl shadow-2xl z-50">
                {/* 统计信息区域 */}
                {/* <div className="flex items-center gap-4 px-3 py-1 rounded-xl bg-slate-700/50 border border-slate-600/30">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-xs text-slate-300">总计</span>
                    <span className="text-sm font-semibold text-white ml-1">{totalCount}</span>
                  </div>
                  <div className="w-px h-4 bg-slate-500/30"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-slate-300">已选</span>
                    <span className="text-sm font-semibold text-emerald-400 ml-1">{selectedCount}</span>
                  </div>
                  <div className="w-px h-4 bg-slate-500/30"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-xs text-slate-300">未选</span>
                    <span className="text-sm font-semibold text-orange-400 ml-1">{unselectedCount}</span>
                  </div>
                </div> */}

                {/* 分隔线 */}
                {/* <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-500/50 to-transparent" /> */}

                {/* 产品选择按钮 */}
                <ConfigProvider theme={{
                  components: {
                    Button: {
                      defaultBg: 'linear-gradient(135deg, #10b981, #059669)',
                      defaultColor: '#ffffff',
                      defaultBorderColor: 'transparent',
                      defaultHoverBg: 'linear-gradient(135deg, #059669, #047857)',
                      defaultHoverBorderColor: 'transparent',
                      defaultHoverColor: '#ffffff',
                      defaultActiveBg: 'linear-gradient(135deg, #047857, #065f46)',
                      defaultActiveBorderColor: 'transparent',
                      defaultActiveColor: '#ffffff',
                      borderRadius: 10,
                    },
                    Dropdown: {
                      colorBgElevated: '#1e293b',
                      colorText: '#f1f5f9',
                      controlItemBgHover: '#334155',
                      colorTextDisabled: '#64748b',
                      borderRadiusLG: 12,
                    },
                  },
                }}
                >
                  <Dropdown
                    open={open}
                    menu={{ items: menuItems, onClick: dropdownMenuClick }}
                    onOpenChange={handleOpenChange}
                    disabled={currentPhoto === null}
                  >
                    <Button
                      icon={<PlusOutlined />}
                    >
                      加入产品
                      <DownOutlined className="ml-1" />
                    </Button>
                  </Dropdown>
                </ConfigProvider>

                {/* 分隔线 */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-500/50 to-transparent" />

                {/* 功能按钮组 */}
                <div className="flex items-center gap-2">
                  <ConfigProvider theme={{
                    components: {
                      Button: {
                        defaultBg: 'rgba(51, 65, 85, 0.8)',
                        defaultColor: '#cbd5e1',
                        defaultBorderColor: 'rgba(71, 85, 105, 0.5)',
                        defaultHoverBg: 'rgba(71, 85, 105, 0.9)',
                        defaultHoverBorderColor: 'rgba(100, 116, 139, 0.8)',
                        defaultHoverColor: '#ffffff',
                        defaultActiveBg: 'rgba(30, 41, 59, 0.9)',
                        defaultActiveBorderColor: 'rgba(51, 65, 85, 0.8)',
                        defaultActiveColor: '#f8fafc',
                        borderRadius: 8,
                      },
                    },
                  }}
                  >
                    <Button
                      icon={<MessageOutlined />}
                      onClick={handleRemark}
                      className="shadow-md hover:shadow-lg transition-all duration-200"
                      title="添加备注"
                    />
                  </ConfigProvider>

                  <div className="w-px h-6 bg-slate-500/30" />

                  <ConfigProvider theme={{
                    components: {
                      Button: {
                        defaultBg: 'rgba(51, 65, 85, 0.8)',
                        defaultColor: '#cbd5e1',
                        defaultBorderColor: 'rgba(71, 85, 105, 0.5)',
                        defaultHoverBg: 'rgba(71, 85, 105, 0.9)',
                        defaultHoverBorderColor: 'rgba(100, 116, 139, 0.8)',
                        defaultHoverColor: '#ffffff',
                        defaultActiveBg: 'rgba(30, 41, 59, 0.9)',
                        defaultActiveBorderColor: 'rgba(51, 65, 85, 0.8)',
                        defaultActiveColor: '#f8fafc',
                        borderRadius: 8,
                      },
                    },
                  }}
                  >
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={zoomIn}
                      className="shadow-md hover:shadow-lg transition-all duration-200"
                      title="放大"
                    />
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={zoomOut}
                      className="shadow-md hover:shadow-lg transition-all duration-200"
                      title="缩小"
                    />
                    <Button
                      icon={<RotateLeftOutlined />}
                      onClick={() => rotateLeft()}
                      className="shadow-md hover:shadow-lg transition-all duration-200"
                      title="逆时针旋转"
                    />
                    <Button
                      icon={<RotateRightOutlined />}
                      onClick={() => rotateRight()}
                      className=" shadow-md hover:shadow-lg transition-all duration-200"
                      title="顺时针旋转"
                    />
                  </ConfigProvider>
                </div>
              </div>

              {/* 左右翻页按钮 */}
              <div
                onClick={() => previous?.()}
                className="absolute z-50 left-8 top-1/2 w-10 h-12 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/50 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <LeftOutlined className="text-slate-200 hover:text-white text-lg" />
              </div>

              <div
                onClick={() => next?.()}
                className="absolute z-50 right-8 top-1/2 w-10 h-12 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/50 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RightOutlined className="text-slate-200 hover:text-white text-lg" />
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
        footer={null}
      >
        <Form form={form}>
          <Form.Item name="remark">
            <Input.TextArea
              placeholder="请输入备注内容"
              rows={3}
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#f1f5f9',
              }}
              classNames={{
                textarea: 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 hover:border-slate-500 hover:bg-slate-600 focus:bg-slate-600 focus:border-slate-400 focus:shadow-sm',
              }}
            />
          </Form.Item>
        </Form>
      </CustomModal>
    </>
  )
}
