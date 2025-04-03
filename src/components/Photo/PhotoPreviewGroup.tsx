import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Photo } from '@/components/Photo/Photo.tsx'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import {
  CalendarOutlined,
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Dropdown, Modal, Spin, Watermark } from 'antd'
import { Children, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import Draggable from 'react-draggable'

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

    if (child.type === Photo) {
      urls.push(child.props)
    }

    if (child.props!.children) {
      urls.push(...getPhotosProps(child.props.children))
    }
  })

  return urls
}

const PhotoPreviewGroup: FC<PropsWithChildren<PhotoPreviewProps>> = ({ preview, children }) => {
  const [open, setOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(true)
  const [imgSrc, setImgSrc] = useState('')
  const [scale, setScale] = useState(1)
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const childProps = useMemo(() => getPhotosProps(children), [children])

  const loadedImage = (src: string) => {
    setImgLoaded(true)
    setImgSrc('')

    const image = new Image()
    image.src = src
    image.onload = () => {
      setImgSrc(src)
      setImgLoaded(false)
    }
  }

  // Prev Photo
  const handlePrev = () => {
    if (isPhotoPreviewGroupType(preview)) {
      preview.onChange?.(Math.max(preview.current! - 1, 0), preview.current!)
    }
  }

  // Next Photo
  const handleNext = () => {
    if (isPhotoPreviewGroupType(preview)) {
      preview.onChange?.(Math.min(preview.current! + 1, childProps.length - 1), preview.current!)
    }
  }

  const handleClose = () => {
    isPhotoPreviewGroupType(preview) ? preview.onVisibleChange?.(!preview.visible) : setOpen(false)
  }

  // Scale Photo
  const handleZoom = (factor: number) => {
    const newScale = Number.parseFloat((scale * factor).toFixed(1))

    setScale(Math.max(1, Math.min(newScale, 1.8)))
  }

  useEffect(() => {
    loadedImage(childProps[isPhotoPreviewGroupType(preview) ? preview.current ?? 0 : 0]?.original_url ?? '')
  }, [childProps, preview])

  useEffect(() => {
    if (imgRef.current && containerRef.current) {
      const { width, height } = imgRef.current
      const containerRect = containerRef.current.getBoundingClientRect()

      const maxLeft = Math.max(0, (width * scale - containerRect.width) / 2)
      const maxRight = Math.max(0, (width * scale - containerRect.width) / 2)
      const maxTop = Math.max(0, (height * scale - containerRect.height) / 2)
      const maxBottom = Math.max(0, (height * scale - containerRect.height) / 2)

      setBounds({
        left: -maxLeft,
        right: maxRight,
        top: -maxTop,
        bottom: maxBottom,
      })
    }
  }, [scale])

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
        width={1200}
        footer={null}
        closeIcon={null}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <div
          className="flex justify-center relative px-16 font-medium select-none"
        >
          <div onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
              <ToolBtn
                icon={<ZoomOutOutlined />}
                onClick={() => handleZoom(0.8)}
              />
              <ToolBtn
                icon={<ZoomInOutlined />}
                onClick={() => handleZoom(1.2)}
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

            <div className="absolute top-4 left-4  flex justify-center gap-2 z-10">
              <Dropdown menu={{ items: [{ label: '产品1', key: '1' }, { label: '产品2', key: '2' }, { type: 'divider' }] }}>
                <ToolBtn icon={<TagOutlined />} />
              </Dropdown>

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
            className="relative flex min-h-[85vh] items-center justify-center overflow-hidden"
          >
            <Watermark content="人像摄影">
              {
                imgLoaded
                  ? <Spin size="large" />
                  : (
                      <Draggable
                        bounds={bounds}
                        scale={scale}
                      >
                        <div ref={containerRef} className="cursor-grab">
                          <img
                            ref={imgRef}
                            draggable={false}
                            style={{ transform: `scale(${scale}) ` }}
                            src={imgSrc}
                            alt=""
                            className="max-h-[85vh] object-contain"
                          />
                        </div>
                      </Draggable>
                    )
              }
            </Watermark>
          </div>

        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default PhotoPreviewGroup
