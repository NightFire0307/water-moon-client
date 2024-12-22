import { Flex, Image, Tag } from 'antd'

export function Photo() {
  return (
    <div>
      <div className="relative bg-gray-400 overflow-hidden rounded-[10px] flex justify-center">
        <Image
          src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
          className="cursor-zoom-in object-contain"
          width={300}
          height={300}
          preview={{
            mask: null,
          }}
          alt="这是一张图片"
        />
      </div>
      <Flex gap="4px 0" align="center" wrap justify="center" className="mt-2">
        <Tag bordered={false} color="gold">入册</Tag>
        <Tag bordered={false} color="gold">摆台</Tag>
        <Tag bordered={false} color="gold">大框</Tag>
        <Tag bordered={false} color="gold">大框</Tag>
        <span className="text-gray-900 font-medium">234234989.jpg</span>
      </Flex>
    </div>
  )
}
