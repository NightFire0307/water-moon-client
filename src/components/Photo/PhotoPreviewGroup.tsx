import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Photo } from '@/components/Photo/Photo.tsx'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import UseDrag from '@/hooks/useDrag'
import {
  CalendarOutlined,
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  ReloadOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Modal } from 'antd'
import cs from 'classnames'
import { Children, isValidElement, useMemo, useState } from 'react'

interface PhotoPreviewProps {
  preview: boolean | PhotoPreviewGroupType
}

interface PhotoPreviewGroupType {
  visible: boolean
  current?: number
  onChange?: (current: number, prevCurrent: number) => void
  onVisibleChange?: (visible: boolean) => void
}

function isPhotoPreviewGroupType(preview: boolean | PhotoPreviewGroupType): preview is PhotoPreviewGroupType {
  return typeof preview !== 'boolean' && preview !== null
}

// 遍历 Children 获取所有的 Photo 组件下的 Props
function getPhotosProps(children: ReactNode) {
  const urls: PhotoProps[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child))
      return

    if (child.type === Photo && child.props.src) {
      urls.push(child.props)
    }

    if (child.props!.children) {
      urls.push(...getPhotosProps(child.props.children))
    }
  })

  return urls
}

const PhotoPreviewGroup: FC<PropsWithChildren<PhotoPreviewProps>> = ({ preview, children }) => {
  const [rotate, setRotate] = useState(0)
  const [open, setOpen] = useState(false)

  // 点击隐藏所有按钮
  const [showControl, setShowControl] = useState(true)

  const {
    onZoomIn,
    onZoomOut,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    containerRef,
    isDragging,
    position,
    imgRef,
    scale,
    reset,
  } = UseDrag()

  const childProps = useMemo(() => getPhotosProps(children), [children])

  // Prev Photo
  const handlePrev = () => {
    if (isPhotoPreviewGroupType(preview)) {
      preview.onChange?.(Math.max(preview.current! - 1, 0), preview.current!)
    }
    reset()
  }

  // Next Photo
  const handleNext = () => {
    if (isPhotoPreviewGroupType(preview)) {
      preview.onChange?.(Math.min(preview.current! + 1, childProps.length - 1), preview.current!)
    }
    reset()
  }

  const handleClose = () => {
    isPhotoPreviewGroupType(preview) ? preview.onVisibleChange?.(!preview.visible) : setOpen(false)
    reset()
  }

  return (
    <ConfigProvider theme={{
      components: {
        Modal: {
          contentBg: '#0f172a',
        },
      },
    }}
    >
      { children }

      <Modal
        open={isPhotoPreviewGroupType(preview) ? preview.visible : open}
        width={1000}
        footer={null}
        closeIcon={null}
        styles={{
          content: {
            position: 'relative',
            padding: 0,
          },
        }}
      >
        <div
          className="flex justify-center relative px-16 font-medium select-none"
          onClick={() => setShowControl(prev => !prev)}
        >
          <div onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          >
            {
              showControl && (
                <>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
                    <ToolBtn
                      icon={<ReloadOutlined className="-scale-x-100" />}
                      onClick={() => setRotate(prev => prev - 90)}
                    />
                    <ToolBtn
                      icon={<ReloadOutlined />}
                      onClick={() => setRotate(prev => prev + 90)}
                    />
                    <ToolBtn
                      icon={<ZoomOutOutlined />}
                      onClick={() => onZoomOut()}
                    />
                    <ToolBtn
                      icon={<ZoomInOutlined />}
                      onClick={() => onZoomIn()}
                    />
                  </div>

                  <div className="absolute left-4 top-1/2 ">
                    <ToolBtn
                      icon={<LeftOutlined />}
                      onClick={handlePrev}
                      disabled={isPhotoPreviewGroupType(preview) && preview.current === 0}
                    />
                  </div>
                  <div className="absolute right-4 top-1/2 ">
                    <ToolBtn
                      icon={<RightOutlined />}
                      onClick={handleNext}
                      disabled={isPhotoPreviewGroupType(preview) && preview.current === childProps.length - 1}
                    />
                  </div>

                  <div className="z-10 absolute left-1/2 -translate-x-1/2 bottom-4 p-4 h-10 bg-darkBlueGray-700/60 backdrop-blur-md flex items-center gap-4 rounded-xl text-white ">
                    <div>
                      IMG_
                      {childProps[isPhotoPreviewGroupType(preview) ? preview.current ?? 0 : 0]?.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <CalendarOutlined />
                      <p>2025-03-24</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <TagOutlined />
                      <div className="text-sm bg-darkBlueGray-700 px-3 rounded-full border border-darkBlueGray-600">缘定今生</div>
                    </div>
                  </div>
                </>
              )
            }

            <div className="absolute top-4 left-4  flex justify-center gap-2 z-10">
              <ToolBtn icon={<TagOutlined />} />
              <ToolBtn icon={<MessageOutlined />} />
            </div>

            <div className="absolute top-4 right-4">
              <ToolBtn
                icon={<CloseOutlined />}
                onClick={handleClose}
              />
            </div>

          </div>

          <div
            ref={containerRef}
            draggable={false}
            onDragStart={e => e.preventDefault()}
            className="inline-flex overflow-hidden min-h-[85vh]"
          >
            <img
              ref={imgRef}
              style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale}) rotate(${rotate}deg)` }}
              className={cs('object-contain max-h-[85vh] cursor-grab', isDragging ? '' : 'transition-all')}
              alt=""
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              src={childProps[isPhotoPreviewGroupType(preview) ? preview.current ?? 0 : 0]?.src}
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default PhotoPreviewGroup
