import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import type { MenuProps } from 'antd'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Photo } from '@/components/Photo/Photo.tsx'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import { usePhotosStore } from '@/stores/photosStore.tsx'
import { useProductsStore } from '@/stores/productsStore.tsx'
import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Dropdown, Modal, Spin, Watermark } from 'antd'
import { Children, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Draggable from 'react-draggable'

interface PhotoPreviewProps {
  preview: boolean | PhotoPreviewGroupType
}

interface PhotoPreviewGroupType {
  visible?: boolean
  current?: number
  onChange?: (current: number, prevCurrent: number) => void
  onVisibleChange?: (visible: boolean) => void
}

function getPreviewGroupType(preview: PhotoPreviewProps['preview']): PhotoPreviewGroupType | undefined {
  return typeof preview === 'boolean' ? undefined : preview
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

  const { photos, removeMarkedProductByPhotoId, removePhotoRemoveTagMenus, updatePhotoAddTagMenus, updatePhotoMarkedProductTypes, updatePhotoRemoveTagMenus } = usePhotosStore()
  const { products, removeSelectedByPhotoId, updateProductSelected } = useProductsStore()

  const childProps = useMemo(() => getPhotosProps(children), [children])

  const previewGroup = useMemo(() => getPreviewGroupType(preview), [preview])

  // 默认下拉菜单
  const defaultItems: MenuProps['items'] = [
    {
      key: 'default',
      label: '标记产品',
      disabled: true,
    },
    {
      type: 'divider',
    },
  ]

  // 产品下拉菜单
  const productItems: MenuProps['items'] = useMemo(() => {
    return products.map(product => ({
      key: product.productId,
      extra: product.product_type,
      label: product.title,
      icon: previewGroup?.current !== undefined && product.selected_photos.includes(childProps[previewGroup.current]?.photoId) ? <CheckOutlined /> : null,
    }))
  }, [products, previewGroup, childProps])

  // 获取图片标记的产品
  const photo_marked_products = useMemo(() => {
    if (previewGroup?.current !== undefined) {
      const photoId = childProps[previewGroup.current]?.photoId
      for (const photo of photos) {
        if (photo.photoId === photoId) {
          return photo.markedProducts
        }
      }
    }
  }, [photos, previewGroup, childProps])

  // 获取图片ID
  const photoId = useMemo(() => {
    if (previewGroup?.current !== undefined) {
      return childProps[previewGroup.current]?.photoId
    }
  }, [previewGroup, childProps])

  useEffect(() => {
    if (previewGroup?.visible !== true)
      return
    if (previewGroup?.current === undefined)
      return
    const src = childProps[previewGroup.current]?.original_url
    if (!src)
      return

    setImgLoaded(true)

    const image = new Image()
    image.src = src
    image.onload = () => {
      requestAnimationFrame(() => {
        setImgSrc(src)
        setImgLoaded(false)
      })
    }
  }, [previewGroup?.current, previewGroup?.visible])

  // Prev Photo
  const handlePrev = () => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      previewGroup.onChange(Math.max(previewGroup.current - 1, 0), previewGroup.current)
    }
  }

  // Next Photo
  const handleNext = () => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      previewGroup.onChange(Math.min(previewGroup.current + 1, childProps.length - 1), previewGroup.current)
    }
  }

  const handleClose = () => {
    if (previewGroup?.onVisibleChange) {
      previewGroup.onVisibleChange(!previewGroup.visible)
    }
    else {
      setOpen(false)
    }
  }

  // Scale Photo
  const handleZoom = (factor: number) => {
    const newScale = Number.parseFloat((scale * factor).toFixed(1))

    setScale(Math.max(1, Math.min(newScale, 1.8)))
  }

  const handleProductClick = useCallback((productId: string) => {
    const photo = photos.find(photo => photo.photoId === photoId)
    if (!photo)
      return

    const productIds = photo.markedProducts.map(product => product.productId)
    if (productIds.includes(+productId)) {
      console.log('包含该产品')
      removeMarkedProductByPhotoId(photo.photoId, +productId)
      removePhotoRemoveTagMenus(photo.photoId, +productId)
      updatePhotoAddTagMenus(photo.photoId, +productId, false)
      removeSelectedByPhotoId(photo.photoId, +productId)
    }
    else {
      console.log('不包含该产品')
      updatePhotoMarkedProductTypes(photo.photoId, +productId)
      updatePhotoRemoveTagMenus(photo.photoId, +productId)
      updatePhotoAddTagMenus(photo.photoId, +productId, true)
      updateProductSelected(photo.photoId, +productId)
    }
  }, [photos, photoId, removeMarkedProductByPhotoId, removePhotoRemoveTagMenus])

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
        open={previewGroup?.visible ? previewGroup.visible : open}
        width={1200}
        footer={null}
        closeIcon={null}
        centered
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
              <Dropdown menu={{ items: [...defaultItems, ...productItems], onClick: ({ key }) => handleProductClick(key) }}>
                <ToolBtn icon={<TagOutlined />} />
              </Dropdown>

              <ToolBtn icon={<MessageOutlined />} />

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
                disabled={previewGroup?.current ? previewGroup.current === 0 : false}
              />
            </div>
            <div className="absolute right-4 top-1/2 ">
              <ToolBtn
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={previewGroup?.current ? previewGroup.current === childProps.length - 1 : false}
              />
            </div>

            <div className="z-10 absolute left-1/2 -translate-x-1/2 bottom-4 p-4 h-10 bg-darkBlueGray-700/60 backdrop-blur-md flex items-center gap-4 rounded-xl text-white ">
              <div>
                IMG_
                {childProps[previewGroup?.current ? previewGroup.current ?? 0 : 0]?.name}
              </div>
              <div className="flex items-center gap-4">
                <CalendarOutlined />
                <p>2025-03-24</p>
              </div>
              <div className="flex items-center gap-2">
                <TagOutlined />

                {
                  photo_marked_products && photo_marked_products.map(product => (
                    <div key={product.productId} className="text-sm bg-darkBlueGray-700 px-3 rounded-full border border-darkBlueGray-600">{product.title}</div>
                  ))
                }
                {/* <div className="text-sm bg-darkBlueGray-700 px-3 rounded-full border border-darkBlueGray-600">缘定今生</div> */}
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <ToolBtn
                icon={<CloseOutlined />}
                onClick={handleClose}
              />
            </div>

          </div>

          <div
            className="relative flex max-h-[80vh] min-h-[80vh] items-center justify-center overflow-hidden"
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
