import type { MenuItemType } from 'antd/es/menu/interface'
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
  types: string[]
  productsMenu: MenuItemType[]
  onDropDownClick?: (keyPay: string[], photoId: number) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, src, types, name, productsMenu, onDropDownClick } = props
  const [removeAllDisabled, setRemoveAllDisabled] = useState<boolean>(true)

  useEffect(() => {
    if (productsMenu) {
      for (const product of productsMenu) {
        if (product.disabled) {
          setRemoveAllDisabled(false)
          break
        }
        else {
          setRemoveAllDisabled(true)
        }
      }
    }
  }, [productsMenu])

  const items: MenuProps['items'] = [
    {
      label: '添加标记',
      key: 'addTag',
      icon: <TagAddIcon />,
      children: productsMenu,
    },
    {
      label: '移除标记',
      key: 'removeTag',
      icon: <TagRemoveIcon />,
      disabled: true,
      children: [],
    },
    {
      label: '移除所有标记',
      key: 'removeAllTag',
      icon: <TagRemoveAllIcon />,
      disabled: removeAllDisabled,
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
        onClick: ({ keyPath }) => onDropDownClick?.(keyPath, photoId),
      }}
      trigger={['contextMenu']}
    >
      <div>
        <div
          className="
          relative
          bg-gray-400
          overflow-hidden
          rounded-[10px]
          flex
          shadow-md
          justify-center"
        >
          <Image
            src={src}
            className="object-contain"
            width={300}
            height={300}
            preview={{
              mask: null,
            }}
          />

        </div>
        <Space direction="vertical" className="w-full flex justify-center">
          <Flex gap="4px 0" align="center" wrap justify="center" className="mt-2">
            {
              types.map((type, index) => (
                <Tag bordered={false} color="gold" key={index}>{type}</Tag>
              ))
            }
          </Flex>
          <div className="text-gray-900 font-medium w-full text-center">{name}</div>
        </Space>
      </div>

    </Dropdown>
  )
}
