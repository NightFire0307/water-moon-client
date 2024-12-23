import { Dropdown, Flex, Image, type MenuProps, Space, Tag } from 'antd'

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
      children: [
        {
          label: '已选',
          key: 'selected',
        },
      ],
    },
    {
      label: '移除标记',
      key: '2',
    },
    {
      label: '删除',
      key: 'delete',
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['contextMenu']}>
      <div>
        <div
          className="
          relative
          bg-gray-400
          overflow-hidden
          rounded-[10px]
          flex
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
