import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from '../stores/productsStore.tsx'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '@/assets/icon'
import { CommentOutlined } from '@ant-design/icons'
import { Dropdown, Image, type MenuProps, Tag } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { PreviewModeContext } from '../App.tsx'

interface PhotoProps {
  photoId: number
  src: string
  name: string
  remark: string
  products: IProduct[]
  addProductsMenus: MenuItemType[]
  removeProductsMenus: MenuItemType[]
  onDropDownClick?: (key: string, photoId: number) => void
  onRemarkClick?: (photoId: number) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, src, products, name, remark, addProductsMenus, removeProductsMenus, onDropDownClick, onRemarkClick } = props
  const [removeDisabled, setRemoveDisabled] = useState<boolean>(true)
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
      <div className="w-full relative">
        <div className="absolute top-2 left-2 z-[999]">
          {
            products.map(product => (
              <Tag bordered={false} color="#324054" key={product.productId}>{product.product_type}</Tag>
            ))
          }
        </div>
        <div className="relative bg-gray-400 overflow-hidden rounded-[10px] flex shadow-md justify-center items-center h-[290px] object-contain ">
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
            src={src}
            preview={{
              mask: null,
            }}
          />
        </div>
        <div className="mt-2 text-gray-900 font-medium text-center">{name}</div>
      </div>

    </Dropdown>
  )
}
