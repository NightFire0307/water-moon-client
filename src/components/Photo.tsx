import { Dropdown, Flex, Image, type MenuProps, Space, Tag } from 'antd'
import {
  NoteEditIcon,
  TagAddIcon,
  TagRemoveAllIcon,
  TagRemoveIcon,
} from '../assets/svg/CustomIcon.tsx'

interface PhotoProps {
  src: string
  name: string
  types: string[]
}

export function Photo(props: PhotoProps) {
  const { src, types, name } = props

  const items: MenuProps['items'] = [
    {
      label: '标记',
      key: '1',
      icon: <TagAddIcon />,
      children: [
        {
          label: '入册',
          key: 'selected',
        },
        {
          label: '组合框',
          key: 'combine',
        },
      ],
    },
    {
      label: '移除标记',
      key: '2',
      icon: <TagRemoveIcon />,
      children: [
        {
          label: '入册',
          key: 'selected',
        },
        {
          label: '组合框',
          key: 'combine',
        },
      ],
    },
    {
      label: '移除所有标记',
      key: 'removeAll',
      icon: <TagRemoveAllIcon />,
    },
    {
      label: '添加备注',
      key: '3',
      icon: <NoteEditIcon />,
    },
  ]

  function onClick(value) {
    console.log(value)
  }

  return (
    <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
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
