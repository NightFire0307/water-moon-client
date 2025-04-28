import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from '../../stores/useProductsStore.tsx'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '@/assets/icon'
import { usePhotoPreviewContext } from '@/contexts/PhotoPreviewContext.ts'
import { useAuthStore } from '@/stores/useAuthStore.tsx'
import { MessageFilled, StarFilled, ZoomInOutlined } from '@ant-design/icons'
import { Dropdown, type MenuProps, Tag } from 'antd'
import cs from 'classnames'
import { forwardRef, useEffect, useRef, useState } from 'react'

export interface PhotoInfo {
  photoId: number
  name: string
}

export interface PhotoProps {
  photoId: number
  index: number
  thumbnail_url: string
  original_url: string
  name: string
  remark?: string
  isRecommend?: boolean
  products: IProduct[]
  addProductsMenus: MenuItemType[]
  removeProductsMenus: MenuItemType[]
  onPreviewClick?: (photoId: number) => void
  onDropDownClick?: (key: string, photoInfo: PhotoInfo) => void
}

export const Photo = forwardRef<HTMLDivElement, PhotoProps>((props, _) => {
  const { photoId, index, thumbnail_url, products, name, remark, addProductsMenus, removeProductsMenus, isRecommend, onDropDownClick, onPreviewClick } = props
  const [removeDisabled, setRemoveDisabled] = useState<boolean>(true)
  const [imgSrc, setImgSrc] = useState<string>('')
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const previewMode = useAuthStore(state => state.isPreview)
  const { registerPhoto } = usePhotoPreviewContext()

  useEffect(() => {
    products.length > 0 ? setRemoveDisabled(false) : setRemoveDisabled(true)
  }, [products])

  const items: MenuProps['items'] = [
    {
      label: '添加标记',
      key: 'addTag',
      icon: <TagAddIcon />,
      children: addProductsMenus,
    },
    {
      label: '移除标记',
      key: 'removeTag',
      icon: <TagRemoveIcon />,
      disabled: removeDisabled,
      children: removeProductsMenus,
    },
    {
      label: '移除所有标记',
      key: 'removeAllTag',
      icon: <TagRemoveAllIcon />,
      disabled: removeDisabled,
    },
    {
      label: '添加备注',
      key: 'addNote',
      icon: <NoteEditIcon />,
    },
  ]

  useEffect(() => {
    // 注册图片到预览上下文中
    registerPhoto(props)

    const el = imageRef.current
    if (!el)
      return

    const observer = new IntersectionObserver((entires) => {
      entires.forEach((entry) => {
        if (entry.isIntersecting) {
          setImgSrc(thumbnail_url)
          observer.unobserve(el)
        }
      })
    }, {
      root: null,
      threshold: 0.5,
    })

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onDropDownClick?.(key, { photoId, name }),
      }}
      trigger={previewMode ? [] : ['contextMenu']}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="min-h-[280px] relative overflow-hidden rounded-xl"
      >
        <div className="absolute top-2 left-2 z-10">
          {
            products.map(product => (
              <Tag bordered={false} color="#1e293b" key={product.productId}>{product.product_type}</Tag>
            ))
          }
        </div>
        {
          isRecommend
          && (
            <div className="absolute top-2 right-2 z-10">
              <StarFilled className="text-amber-400 text-lg" />
            </div>
          )
        }

        {
          remark
          && (
            <div className="absolute bottom-12 right-2 z-10">
              <MessageFilled className="text-darkBlueGray-700 text-lg" />
            </div>
          )
        }

        <div
          className="relative bg-darkBlueGray-200 overflow-hidden rounded-tl-xl rounded-tr-xl flex shadow-md justify-center items-center"
        >
          <img
            className="cursor-pointer object-contain max-h-[240px]"
            loading="lazy"
            decoding="async"
            ref={imageRef}
            src={imgSrc}
            alt=""
          />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center h-10
          bg-gradient-to-r from-darkBlueGray-900 to-darkBlueGray-700
          font-mono text-darkBlueGray-50 font-semibold"
        >
          <div>
            IMG_
            {name}
          </div>
          <div className="text-darkBlueGray-400">{index}</div>
        </div>

        {/* Mask */}
        <div
          className={
            cs('absolute top-0 left-0 right-0 bottom-10 bg-darkBlueGray-900/50 flex justify-center items-center transition duration-300 ease-in-out cursor-pointer', isHovered ? 'opacity-100' : 'opacity-0')
          }
          onClick={() => onPreviewClick && onPreviewClick(photoId)}
        >
          <div className="w-10 h-10 rounded-md bg-darkBlueGray-50 text-xl flex justify-center items-center">
            <ZoomInOutlined className="text-darkBlueGray-800" />
          </div>
        </div>
      </div>
    </Dropdown>

  )
})
