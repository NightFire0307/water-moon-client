import { HeartFilled, LikeFilled, StarFilled } from '@ant-design/icons'
import { Image, Space } from 'antd'

export function Photo() {
  return (
    <div className="relative bg-[#eaeaea] overflow-hidden rounded-[10px] flex justify-center">
      <span className="absolute top-1 left-2 text-xl z-10">
        <Space direction="vertical" size={4}>
          <HeartFilled style={{ color: '#fa541c' }} />
          <StarFilled style={{ color: '#faad14' }} />
          <LikeFilled style={{ color: '#52c41a' }} />
        </Space>
      </span>
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
  )
}
