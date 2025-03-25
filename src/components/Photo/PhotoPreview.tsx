import type { FC, ReactElement } from 'react'
import { CloseOutlined, TagOutlined } from '@ant-design/icons'

interface PhotoPreviewProps {
  originalNode: ReactElement
  info: {
    transform: {
      x: number
      y: number
      rotate: number
      scale: number
      flipX: boolean
      flipY: boolean
    }
    image: {
      url: string
      alt: string
      width: string | number
      height: string | number
    }
    current: number
  }
}

const PhotoPreview: FC = () => {
  return (
    <div className="relative rounded-xl px-16 bg-darkBlueGray-1000 w-[896px] h-[896px] overflow-hidden font-medium">
      <div className="absolute left-0 top-0 right-0 p-3">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="flex justify-center items-center w-8 h-8 rounded-md bg-white/90 text-darkBlueGray-1000 cursor-pointer">
              <TagOutlined />
            </div>
            <div className="flex justify-center items-center w-8 h-8 rounded-md bg-white/90 text-darkBlueGray-1000 cursor-pointer">
              <TagOutlined />
            </div>
          </div>
          <div className="flex justify-center items-center w-8 h-8 rounded-md bg-white/90 text-darkBlueGray-1000 cursor-pointer">
            <CloseOutlined />
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-white">
      </div>

      <div className=" absolute left-0 bottom-0 right-0 h-16 p-3 bg-darkBlueGray-1000/85 backdrop-blur-md text-white text-start leading-normal">
        <div>IMG_0012</div>
        <div className="text-darkBlueGray-500">拍摄时间: 2025年3月18日</div>
      </div>
    </div>
  )
}

export default PhotoPreview
