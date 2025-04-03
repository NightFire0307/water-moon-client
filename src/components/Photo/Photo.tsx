import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from '../../stores/productsStore.tsx'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '@/assets/icon'
import { PreviewModeContext } from '@/contexts/PreviewModeContext.ts'
import { CommentOutlined, ZoomInOutlined } from '@ant-design/icons'
import { Dropdown, Image, type MenuProps, Tag } from 'antd'
import cs from 'classnames'
import { useContext, useEffect, useState } from 'react'

export interface PhotoProps {
  photoId: number
  thumbnail_url: string
  original_url: string
  name: string
  remark: string
  products: IProduct[]
  addProductsMenus: MenuItemType[]
  removeProductsMenus: MenuItemType[]
  onPreviewClick?: (photoId: number) => void
  onDropDownClick?: (key: string, photoId: number) => void
  onRemarkClick?: (photoId: number) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, thumbnail_url, products, name, remark, addProductsMenus, removeProductsMenus, onDropDownClick, onRemarkClick, onPreviewClick } = props
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
      className="mt-4"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full relative overflow-hidden rounded-xl"
      >
        <div className="absolute top-2 left-2 z-10">
          {
            products.map(product => (
              <Tag bordered={false} color="#324054" key={product.productId}>{product.product_type}</Tag>
            ))
          }
        </div>
        <div className="relative bg-darkBlueGray-200 overflow-hidden rounded-xl flex shadow-md justify-center items-center h-[300px] object-contain">
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
            className="max-w-[300px] max-h-[300px] w-auto h-auto cursor-pointer"
            src={thumbnail_url}
            preview={{
              mask: null,
            }}
          />
        </div>
        <div
          className="absolute p-2 flex justify-between items-center
          bottom-0 left-0 right-0 h-10
          bg-gradient-to-r from-darkBlueGray-900 to-darkBlueGray-700
          text-white font-mono"
        >
          <div>
            IMG_
            {name}
          </div>
          <div className="text-sm text-darkBlueGray-200">1.3MB</div>
        </div>

        {/* Mask */}
        <div
          className={
            cs('absolute top-0 left-0 right-0 bottom-10 bg-darkBlueGray-900/50 flex justify-center items-center transition duration-300 ease-in-out cursor-pointer', isHovered ? 'opacity-100' : 'opacity-0')
          }
          onClick={() => onPreviewClick && onPreviewClick(photoId)}
        >
          <div className="w-10 h-10 rounded-md bg-white text-xl flex justify-center items-center">
            <ZoomInOutlined />
          </div>
        </div>
      </div>
    </Dropdown>
  )
}
