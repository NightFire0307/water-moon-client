import { Flex, Image, Space, Tag } from 'antd'

interface PhotoProps {
  src: string
  name: string
  types: string[]
}

export function Photo(props: PhotoProps) {
  const { src, types, name } = props

  return (
    <div>
      <div className="relative bg-gray-400 overflow-hidden rounded-[10px] flex justify-center">
        <Image
          src={src}
          className="cursor-zoom-in object-contain"
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
  )
}
