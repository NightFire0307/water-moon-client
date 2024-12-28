import type { MenuItemType } from 'antd/es/menu/interface'
import type { IProduct } from '../stores/productsStore.tsx'
import { animated, config, useSpring } from '@react-spring/web'
import { Dropdown, Flex, Image, type MenuProps, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '../assets/svg/CustomIcon.tsx'

interface PhotoProps {
  photoId: number
  src: string
  name: string
  products: IProduct[]
  addProductsMenus: MenuItemType[]
  removeProductsMenus: MenuItemType[]
  onDropDownClick?: (key: string, photoId: number) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, src, products, name, addProductsMenus, removeProductsMenus, onDropDownClick } = props
  const [removeDisabled, setRemoveDisabled] = useState<boolean>(true)
  const springs = useSpring({
    from: { scale: 0.5, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: config.gentle,
  })

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
      key: 'add_note',
      icon: <NoteEditIcon />,
    },
  ]

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onDropDownClick?.(key, photoId),
      }}
      trigger={['contextMenu']}
    >
      <animated.div style={springs}>
        <div
          className="
          relative
          bg-gray-400
          overflow-hidden
          rounded-[10px]
          flex
          shadow-md
          justify-center
          items-center
          h-[250px]
          object-contain
          "
        >
          <Image
            className="max-w-[250px] max-h-[250px] w-auto h-auto"
            src={src}
            preview={{
              mask: null,
            }}
          />

        </div>
        <Space direction="vertical" className="w-full flex justify-center">
          <Flex gap="4px 0" align="center" wrap justify="center" className="mt-2">
            {
              products.map(product => (
                <Tag bordered={false} color="gold" key={product.productId}>{product.type}</Tag>
              ))
            }
          </Flex>
          <div className="text-gray-900 font-medium w-full text-center">{name}</div>
        </Space>
      </animated.div>

    </Dropdown>
  )
}
