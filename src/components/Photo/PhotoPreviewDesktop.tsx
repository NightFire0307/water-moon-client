import type { PhotoProps } from '@/components/Photo/Photo.tsx'
import type { MenuProps } from 'antd'
import type { FC, PropsWithChildren } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import PhotoRemarkModal from '@/components/Photo/PhotoRemarkModal.tsx'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import { PhotoPreviewContext } from '@/contexts/PhotoPreviewContext.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { usePhotosStore } from '@/stores/usePhotosStore.tsx'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
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
import { Dropdown, Spin, Watermark } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Draggable from 'react-draggable'

interface PhotoPreviewProps {
  preview: boolean | PhotoReviewDesktopType
}

interface PhotoReviewDesktopType {
  visible?: boolean
  current?: number
  onChange?: (current: number, prevCurrent: number) => void
  onVisibleChange?: (visible: boolean) => void
}

function getPreviewGroupType(preview: PhotoPreviewProps['preview']): PhotoReviewDesktopType | undefined {
  return typeof preview === 'boolean' ? undefined : preview
}

const PhotoReviewDesktop: FC<PropsWithChildren<PhotoPreviewProps>> = ({ preview, children }) => {
  const [images, setImages] = useState<PhotoProps[]>([])
  const [previewState, setPreviewState] = useState({
    open: false,
    imgSrc: '',
    scale: 1,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    imgLoaded: true,
  })
  const [remarkOpen, setRemarkOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isPreview = useAuthStore(state => state.isPreview)
  const { photos, removeMarkedProductByPhotoId, removePhotoRemoveTagMenus, updatePhotoAddTagMenus, updatePhotoMarkedProductTypes, updatePhotoRemoveTagMenus } = usePhotosStore()
  const { products, removeSelectedByPhotoId, updateProductSelected } = useProductsStore()

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
      icon: previewGroup?.current !== undefined && product.selected_photos.includes(images[previewGroup.current]?.photoId) ? <CheckOutlined /> : null,
    }))
  }, [products, previewGroup])

  // 注册图片
  const registerPhoto = useCallback((image: PhotoProps) => {
    setImages(prev => [...prev, image])
  }, [])

  const photo_marked_products = useMemo(() => {
    if (previewGroup?.current !== undefined) {
      const photoId = images[previewGroup.current]?.photoId
      return photos.find(photo => photo.photoId === photoId)?.markedProducts
    }
  }, [images, photos, previewGroup])

  // 预加载图片
  useEffect(() => {
    if (previewGroup?.visible !== true || previewGroup?.current === undefined)
      return
    const src = images[previewGroup?.current].original_url
    if (!src)
      return

    setPreviewState(prev => ({ ...prev, imgLoaded: true }))

    const image = new Image()
    image.src = src
    image.onload = () => {
      requestAnimationFrame(() => {
        setPreviewState(prev => ({ ...prev, imgSrc: src, imgLoaded: false }))
      })
    }
  }, [previewGroup?.current, previewGroup?.visible, images])

  /**
   * 限制范围
   * @param value 当前值
   * @param min 最小值
   * @param max 最大值
   */
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

  // Prev Photo
  const handlePrev = () => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      const newIndex = clamp(previewGroup.current - 1, 0, images.length - 1)
      previewGroup.onChange(newIndex, previewGroup.current)
    }
  }

  // Next Photo
  const handleNext = () => {
    if (previewGroup?.onChange && previewGroup?.current !== undefined) {
      const newIndex = clamp(previewGroup.current + 1, 0, images.length - 1)
      previewGroup.onChange(newIndex, previewGroup.current)
    }
  }

  const handleClose = () => {
    setDropdownOpen(false)

    setTimeout(() => {
      setPreviewState({ ...previewState, scale: 1 })
      if (previewGroup?.onVisibleChange) {
        previewGroup.onVisibleChange(false)
      }
      else {
        setPreviewState({ ...previewState, open: false })
      }
    }, 0)
  }

  // Scale Photo
  const handleZoom = (factor: number) => {
    const newScale = Number.parseFloat((previewState.scale * factor).toFixed(1))
    setPreviewState({ ...previewState, scale: Math.max(1, Math.min(newScale, 1.8)) })
  }

  // 获取图片Props
  const photoProps = useMemo(() => {
    if (previewGroup?.current !== undefined) {
      return images[previewGroup.current]
    }
  }, [previewGroup, images])

  const handleProductClick = useCallback((productId: string) => {
    const photo = photos.find(photo => photo.photoId === photoProps?.photoId)
    if (!photo)
      return

    const productIds = photo.markedProducts.map(product => product.productId)
    if (productIds.includes(+productId)) {
      removeMarkedProductByPhotoId(photo.photoId, +productId)
      removePhotoRemoveTagMenus(photo.photoId, +productId)
      updatePhotoAddTagMenus(photo.photoId, +productId, false)
      removeSelectedByPhotoId(photo.photoId, +productId)
    }
    else {
      updatePhotoMarkedProductTypes(photo.photoId, +productId)
      updatePhotoRemoveTagMenus(photo.photoId, +productId)
      updatePhotoAddTagMenus(photo.photoId, +productId, true)
      updateProductSelected(photo.photoId, +productId)
    }
  }, [photos, photoProps, removeMarkedProductByPhotoId, removePhotoRemoveTagMenus])

  useEffect(() => {
    if (imgRef.current && containerRef.current) {
      const { width, height } = imgRef.current
      const containerRect = containerRef.current.getBoundingClientRect()

      const maxLeft = Math.max(0, (width * previewState.scale - containerRect.width) / 2)
      const maxRight = Math.max(0, (width * previewState.scale - containerRect.width) / 2)
      const maxTop = Math.max(0, (height * previewState.scale - containerRect.height) / 2)
      const maxBottom = Math.max(0, (height * previewState.scale - containerRect.height) / 2)

      setPreviewState(prev => ({
        ...prev,
        bounds: {
          ...prev.bounds,
          left: -maxLeft,
          right: maxRight,
          top: -maxTop,
          bottom: maxBottom,
        },
      }))
    }
  }, [previewState.scale])

  useEffect(() => {
    const closeDropDownMenu = () => setDropdownOpen(false)
    document.addEventListener('click', closeDropDownMenu)

    return () => {
      document.removeEventListener('click', closeDropDownMenu)
    }
  }, [])

  useEffect(() => {
    if (previewGroup?.visible || previewState.open) {
      // 事件处理函数
      const keyDownHandler = (e: KeyboardEventInit) => {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrev()
            break
          case 'ArrowRight':
            handleNext()
            break
          default:
            break
        }
      }

      document.addEventListener('keydown', keyDownHandler)

      // 清理函数
      return () => {
        document.removeEventListener('keydown', keyDownHandler)
      }
    }
  }, [previewGroup?.visible, previewState.open, handlePrev, handleNext])

  return (
    <>
      <PhotoPreviewContext.Provider value={{ registerPhoto }}>
        { children }

        <CustomModal
          open={previewGroup?.visible ? previewGroup.visible : previewState.open}
          width={1200}
          centered
          footer={null}
          closeIcon={null}
          styles={{
            content: {
              padding: 0,
            },
          }}
        >
          <div
            className="flex justify-center relative px-16 font-medium select-none min-h-[60vh] max-h-[80vh]"
          >
            <div onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            >
              <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
                {
                  !isPreview
                  && (
                    <Dropdown
                      open={dropdownOpen}
                      menu={{ items: [...defaultItems, ...productItems], onClick: ({ key }) => handleProductClick(key) }}
                    >
                      <ToolBtn
                        icon={<TagOutlined />}
                        onMouseEnter={() => setDropdownOpen(true)}
                      />
                    </Dropdown>
                  )
                }

                <ToolBtn icon={<MessageOutlined />} onClick={() => setRemarkOpen(true)} />

                <ToolBtn
                  icon={<ZoomOutOutlined />}
                  onClick={() => handleZoom(0.8)}
                />
                <ToolBtn
                  icon={<ZoomInOutlined />}
                  onClick={() => handleZoom(1.2)}
                />
              </div>
              <div className="text-xs md:text-xs z-10 absolute left-1/2 -translate-x-1/2 bottom-2 md:bottom-4 p-2 md:p-4 h-auto bg-darkBlueGray-700/60 backdrop-blur-md flex flex-col gap-1 items-center rounded-xl text-white ">
                <div className="flex gap-2">
                  <div>
                    IMG_
                    {photoProps?.name ?? ''}
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <CalendarOutlined />
                    <p>2025-03-24</p>
                  </div>
                </div>

                {
                  (photo_marked_products?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-1 md:gap-2 w-full overflow-auto">
                      <TagOutlined />

                      {
                        photo_marked_products?.map(product => (
                          <div key={product.productId} className="flex-shrink-0 text-xs bg-darkBlueGray-700 px-3 rounded-full border border-darkBlueGray-600">{product.title}</div>
                        ))
                      }
                    </div>
                  )
                }

              </div>
              <div className="absolute top-2 md:top-4 right-4">
                <ToolBtn
                  icon={<CloseOutlined />}
                  onClick={handleClose}
                />
              </div>

              <div className="absolute left-4 top-1/2 ">
                <ToolBtn
                  icon={<LeftOutlined />}
                  onClick={handlePrev}
                  disabled={previewGroup?.current !== undefined ? previewGroup.current === 0 : false}
                />
              </div>
              <div className="absolute right-4 top-1/2 ">
                <ToolBtn
                  icon={<RightOutlined />}
                  onClick={handleNext}
                  disabled={previewGroup?.current ? previewGroup.current === images.length - 1 : false}
                />
              </div>
            </div>

            <div
              className="relative flex items-center justify-center"
            >
              <Watermark content="人像摄影" className="max-h-full">
                {
                  previewState.imgLoaded
                    ? <Spin size="large" />
                    : (
                        <Draggable
                          bounds={previewState.bounds}
                          scale={previewState.scale}
                        >
                          <div ref={containerRef} className="cursor-grab">
                            <img
                              ref={imgRef}
                              draggable={false}
                              style={{ transform: `scale(${previewState.scale}) ` }}
                              src={previewState.imgSrc}
                              alt=""
                              className="object-contain max-h-[80vh]"
                            />
                          </div>
                        </Draggable>
                      )
                }
              </Watermark>
            </div>

          </div>
        </CustomModal>

      </PhotoPreviewContext.Provider>

      <PhotoRemarkModal
        open={remarkOpen}
        photoId={photoProps?.photoId ?? -1}
        photoName={photoProps?.name ?? ''}
        onClose={() => setRemarkOpen(false)}
      />
    </>
  )
}

export default PhotoReviewDesktop
