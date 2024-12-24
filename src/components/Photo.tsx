import { Dropdown, Flex, Image, type MenuProps, Space, Tag } from 'antd'
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
  productsMenu: MenuProps['items']
  onDropDownClick?: (photoId: number, { key }: { key: string }) => void
}

export function Photo(props: PhotoProps) {
  const { photoId, src, types, name, productsMenu, onDropDownClick } = props

  const items: MenuProps['items'] = [
    {
      label: '标记',
      key: '1',
      icon: <TagAddIcon />,
      children: productsMenu,
    },
    {
      label: '移除标记',
      key: '2',
      icon: <TagRemoveIcon />,
      disabled: true,
      children: [],
    },
    {
      label: '移除所有标记',
      key: 'removeAll',
      icon: <TagRemoveAllIcon />,
      disabled: true,
    },
    {
      label: '添加备注',
      key: '3',
      icon: <NoteEditIcon />,
    },
  ]

  return (
    <Dropdown menu={{ items, onClick: e => onDropDownClick?.(photoId, e) }} trigger={['contextMenu']}>
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
