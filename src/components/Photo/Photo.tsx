import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from '../../stores/productsStore.tsx'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '@/assets/icon'
import { PreviewModeContext } from '@/contexts/PreviewModeContext.ts'
import { CommentOutlined, StarFilled, ZoomInOutlined } from '@ant-design/icons'
import { Dropdown, Image, type MenuProps, Tag } from 'antd'
import cs from 'classnames'
import { useContext, useEffect, useState } from 'react'

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
  onDropDownClick?: (key: string, photoId: number) => void
  onRemarkClick?: (photoId: number) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, index, thumbnail_url, products, name, remark, addProductsMenus, removeProductsMenus, isRecommend, onDropDownClick, onRemarkClick, onPreviewClick } = props
  const [removeDisabled, setRemoveDisabled] = useState<boolean>(true)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const previewMode = useContext(PreviewModeContext)

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

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onDropDownClick?.(key, photoId),
      }}
      trigger={previewMode ? [] : ['contextMenu']}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full relative overflow-hidden rounded-xl"
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
              <StarFilled className="text-amber-400 text-base" />
            </div>
          )
        }
        <div className="relative bg-darkBlueGray-200 overflow-hidden rounded-tl-xl rounded-tr-xl flex shadow-md justify-center items-center max-h-[220px]">
          {
            remark && (
              <div
                className="cursor-pointer rounded-2xl flex justify-center items-center absolute top-2 right-2 text-base text-geekBlue-600 w-[30px] h-[30px] bg-geekBlue-200"
                onClick={() => onRemarkClick?.(photoId)}
              >
                <CommentOutlined />
              </div>
            )
          }
          <Image
            className="cursor-pointer object-contain"
            src={thumbnail_url}
            preview={{
              mask: null,
            }}
          />
        </div>
        <div
          className="p-2 flex justify-between items-center h-10
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
}
