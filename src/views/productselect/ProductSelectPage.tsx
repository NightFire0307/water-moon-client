import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Layout, Modal, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import zhCN from 'antd/locale/zh_CN'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConditionTip } from '@/components/ConditionTip/ConditionTip'
import { MainViewer } from '@/components/MainViewer/MainViewer'
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar'
import { StepHeader } from '@/components/StepHeader/StepHeader'
import { ThumbnailBar } from '@/components/ThumbnailBar/ThumbnailBar'
import { ViewerControl } from '@/components/ViewerControl/ViewerControl'
import { PhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { FILTER_TYPE, usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { usePhotoViewerStore } from '@/stores/usePhotoViewerStore'
import { useProductsStore } from '@/stores/useProductsStore'

const { Content } = Layout
const { Text } = Typography

function ProductSelectPage() {
  const [thumbnailVisible, setThumbnailVisible] = useState(false)
  const [viewerControlVisible, setViewerControlVisible] = useState(true)
  const [productSidebarVisible, setProductSidebarVisible] = useState(false)
  const [keyboardDisabled, setKeyboardDisabled] = useState(false)
  const [submitModalVisible, setSubmitModalVisible] = useState(false)
  const [conditionTipState, setConditionTipState] = useState({
    visible: false,
    msg: '',
  })
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const { productSelectedPhotos, filter, currentPhoto, setCurrentPhoto } = usePhotosStore()
  const { next, previous, currentIndex, setCurrentIndex } = usePhotoViewerStore()
  const { setDropdownMenuStatus } = useProductsStore()

  // 模拟数据 - 实际使用时应该从store获取
  const mockStats = {
    totalProducts: 5,
    assignedPhotos: 28,
    unassignedPhotos: 12, // 修改为0可以测试无警告状态
  }

  // 是否有未分配的照片
  const hasUnassignedPhotos = mockStats.unassignedPhotos > 0

  const filteredPhotos = useMemo(() => {
    const { productId, filterType } = filter

    // 过滤指定产品的照片
    if (filterType === FILTER_TYPE.SELECTED && productId !== undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.includes(productId)
      })
    }

    // 过滤已选的照片
    if (filterType === FILTER_TYPE.SELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length > 0
      })
    }

    // 过滤未选的照片
    if (filterType === FILTER_TYPE.UNSELECTED && productId === undefined) {
      return productSelectedPhotos.filter((photo) => {
        return photo.selectedProducts.length === 0
      })
    }

    return productSelectedPhotos
  }, [filter, productSelectedPhotos])

  // 监听过滤后的照片变化，自动设置当前第一张照片
  useEffect(() => {
    setCurrentPhoto(filteredPhotos[0] || null)
  }, [filteredPhotos, setCurrentPhoto])

  // 控制提示信息显示
  // 例如：当切换到最后一张照片时，显示提示信息
  const showConditionTip = useCallback((msg: string) => {
    setConditionTipState({
      visible: true,
      msg,
    })
    setTimeout(() => {
      setConditionTipState({ visible: false, msg: '' })
    }, 1500)
  }, [])

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    // 避免在输入框中触发
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (currentIndex !== 0) {
          const previousPhoto = filteredPhotos[currentIndex - 1]
          setCurrentPhoto(previousPhoto)
          setDropdownMenuStatus(previousPhoto.selectedProducts)
          previous()
        }
        else {
          showConditionTip('已经是第一张照片了')
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (currentIndex < filteredPhotos.length - 1) {
          const nextPhoto = filteredPhotos[currentIndex + 1]
          setCurrentPhoto(nextPhoto)
          setDropdownMenuStatus(nextPhoto.selectedProducts)
          next()
        }
        else {
          showConditionTip('已经是最后一张照片了')
        }

        break
      default:
        break
    }
  }, [currentIndex, filteredPhotos, next, previous, setCurrentPhoto, setDropdownMenuStatus, showConditionTip])

  // 全局按键事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

  useEffect(() => {
    if (currentPhoto === null) {
      setCurrentPhoto(productSelectedPhotos[0])
    }
  }, [productSelectedPhotos, currentPhoto, setDropdownMenuStatus])

  return (
    <PhotoViewerContext.Provider value={{
      thumbnailVisible,
      setThumbnailVisible,
      viewerControlVisible,
      setViewerControlVisible,
      productSidebarVisible,
      setProductSidebarVisible,
      keyboardDisabled,
      setKeyboardDisabled,
    }}
    >
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorBgElevated: '#334155',
            colorText: '#f8fafc',
            colorTextDisabled: '#64748b',
            colorTextDescription: '#94a3b8',
            controlItemBgHover: '#475569',
          },
          components: {
            Modal: {
              contentBg: '#1e293b',
            },
            Button: {
              borderColorDisabled: '#475569',
              defaultBg: '#334155',
              defaultColor: '#e2e8f0',
              defaultBorderColor: '#475569',
              defaultActiveBg: '#0f172a',
              defaultActiveBorderColor: '#1e293b',
              defaultActiveColor: '#e2e8f0',
              defaultHoverBg: '#475569',
              defaultHoverBorderColor: '#475569',
              defaultHoverColor: '#ffffff',
              textTextColor: '#94a3b8',
              textHoverBg: '#475569',
              textTextActiveColor: '#cbd5e1',
              textTextHoverColor: '#f8fafc',
            },
          },
        }}
      >
        <Layout className={`h-screen relative bg-gradient-to-br from-darkBlueGray-950 via-darkBlueGray-900 to-darkBlueGray-950 overflow-hidden `}>
          <Header>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-0 z-30 bg-darkBlueGray-900/70 backdrop-blur-md border-b border-darkBlueGray-700/30"
            >
              <div
                className="flex items-center justify-between px-4 py-2"
              >
                <div className="flex items-end gap-4">
                  <StepHeader stepNumber={3} stepTitle="产品选片" stepDesc="Product Selection" />
                  <div className="flex flex-col text-xs text-darkBlueGray-400 mb-0.5">
                    <span>最近保存时间</span>
                    <span>2025-07-29 16:27:16</span>
                  </div>
                </div>

                <Button type="primary" onClick={() => setSubmitModalVisible(true)}>
                  下一步：提交选片结果
                  <RightOutlined />
                </Button>
              </div>

            </motion.div>
          </Header>

          <Layout className="bg-darkBlueGray-900">
            <Sider width={320} className="bg-darkBlueGray-900">
              {/* 产品侧边栏 */}
              <ProductSidebar />
            </Sider>

            {/* 主视图区域 */}
            <Content className="relative p-4">
              <ViewerControl transformRef={transformRef} />
              <MainViewer transformRef={transformRef} />
              <ThumbnailBar
                photos={filteredPhotos}
                currentIndex={currentIndex}
                onClickThumbnail={(item, index) => {
                  setCurrentIndex(index)
                  setCurrentPhoto(item)
                }}
              />
              <ConditionTip
                visible={conditionTipState.visible}
                msg={conditionTipState.msg}
                centered
              />
            </Content>
          </Layout>
        </Layout>

        {/* 提交选片结果Modal */}
        <Modal
          open={submitModalVisible}
          title="确认提交选片结果"
          onOk={() => {
            // TODO: 实际提交逻辑
            setSubmitModalVisible(false)
          }}
          onCancel={() => setSubmitModalVisible(false)}
          centered
          width={480}
          footer={[
            <Button
              key="cancel"
              onClick={() => setSubmitModalVisible(false)}
              className="mr-2"
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              disabled={hasUnassignedPhotos}
              onClick={() => {
                // TODO: 实际提交逻辑
                setSubmitModalVisible(false)
              }}
            >
              {hasUnassignedPhotos ? '请先完成照片分配' : '确认提交'}
            </Button>,
          ]}
        >
          <div className="py-4">
            {/* 提示信息 */}
            {hasUnassignedPhotos
              ? (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExclamationCircleOutlined className="text-red-400 text-lg mt-0.5" />
                      <div>
                        <div className="text-red-200 font-medium mb-1">警告：还有未分配的照片</div>
                        <div className="text-red-300 text-sm leading-relaxed">
                          检测到还有
                          {' '}
                          {mockStats.unassignedPhotos}
                          {' '}
                          张照片未分配给任何产品。
                          请完成所有照片的分配后再提交，或确认这些照片不需要分配。
                        </div>
                      </div>
                    </div>
                  </div>
                )
              : (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExclamationCircleOutlined className="text-green-400 text-lg mt-0.5" />
                      <div>
                        <div className="text-green-200 font-medium mb-1">选片完成</div>
                        <div className="text-green-300 text-sm leading-relaxed">
                          所有照片已完成分配，可以提交选片结果。
                          系统将自动保存您的选择并生成最终的选片报告。
                        </div>
                      </div>
                    </div>
                  </div>
                )}

            {/* 选片统计信息 */}
            <div className="space-y-4">
              <div className="text-slate-200 font-medium mb-3">选片统计</div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">产品总数</div>
                  <div className="text-blue-400 text-xl font-bold">{mockStats.totalProducts}</div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">已分配照片</div>
                  <div className="text-green-400 text-xl font-bold">{mockStats.assignedPhotos}</div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-sm">未分配照片</div>
                  <div className={`text-xl font-bold ${hasUnassignedPhotos ? 'text-red-400' : 'text-gray-400'}`}>
                    {mockStats.unassignedPhotos}
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-slate-400 text-sm mb-2">产品选片详情</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>• 产品A - 婚纱照</span>
                    <span className="text-blue-400">12张</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>• 产品B - 艺术照</span>
                    <span className="text-blue-400">8张</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>• 产品C - 生活照</span>
                    <span className="text-blue-400">8张</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>• 产品D - 写真</span>
                    <span className="text-gray-400">0张</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>• 产品E - 全家福</span>
                    <span className="text-gray-400">0张</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </ConfigProvider>

    </PhotoViewerContext.Provider>

  )
}

export default ProductSelectPage
