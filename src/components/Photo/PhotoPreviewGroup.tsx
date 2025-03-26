import type { FC, PropsWithChildren } from 'react'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import {
  CalendarOutlined,
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  ReloadOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { ConfigProvider, Modal } from 'antd'
import { useState } from 'react'

interface PhotoPreviewProps {
  preview: boolean | PhotoPreviewGroupType
}

interface PhotoPreviewGroupType {
  visible: boolean
}

const PhotoPreviewGroup: FC<PropsWithChildren<PhotoPreviewProps>> = ({ preview, children }) => {
  const [scale, setScale] = useState<number>(1)
  const [rotate, setRotate] = useState(0)
  const isPreviewObject = typeof preview !== 'boolean' && preview !== null
  // 点击隐藏所有按钮
  const [showControl, setShowControl] = useState(true)

  return (
    <ConfigProvider theme={{
      components: {
        Modal: {
          contentBg: '#0f172a',
        },
      },
    }}
    >
      { children }

      <Modal
        open={isPreviewObject ? preview.visible : false}
        width={1000}
        footer={null}
        closeIcon={null}
        styles={{
          content: {
            position: 'relative',
            padding: 0,
          },
        }}
      >
        <div className="relative px-16 font-medium">
          {
            showControl && (
              <>
                <div className="absolute top-4 left-4  flex justify-center gap-2 z-10">
                  <ToolBtn icon={<TagOutlined />} />
                  <ToolBtn icon={<MessageOutlined />} />
                </div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
                  <ToolBtn icon={<ReloadOutlined className="-scale-x-100" />} onClick={() => setRotate(prev => Math.max(prev - 90, 0))} />
                  <ToolBtn icon={<ReloadOutlined />} onClick={() => setRotate(prev => Math.min(prev + 90, 360))} />
                  <ToolBtn icon={<ZoomOutOutlined />} onClick={() => setScale(prev => Math.max(prev / 2, 1))} />
                  <ToolBtn icon={<ZoomInOutlined />} onClick={() => setScale(prev => Math.min(prev * 2, 4))} />
                </div>
                <div className="absolute top-4 right-4">
                  <ToolBtn icon={<CloseOutlined />} />
                </div>

                <div className="absolute left-4 top-1/2 ">
                  <ToolBtn icon={<LeftOutlined />} />
                </div>
                <div className="absolute right-4 top-1/2 ">
                  <ToolBtn icon={<RightOutlined />} />
                </div>

                <div className="z-10 absolute left-1/2 -translate-x-1/2 bottom-4 p-4 h-10 bg-darkBlueGray-800/60 backdrop-blur-md flex items-center gap-4 rounded-xl text-white ">
                  <div>IMG_001</div>
                  <div className="flex items-center gap-4">
                    <CalendarOutlined />
                    <p>2025-03-24</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <TagOutlined />
                    <div className="text-sm bg-darkBlueGray-700 px-3 rounded-full border border-darkBlueGray-600">缘定今生</div>
                  </div>
                </div>
              </>
            )
          }

          <div className="w-full h-full flex justify-center overflow-hidden" onClick={() => setShowControl(!showControl)}>
            <img
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              className="object-contain max-h-[85vh]"
              alt=""
              src="http://192.168.26.246:9090/water-moon/D1212/D71T6454?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YJV7PFvKGTnYaFEdPcBi%2F20250324%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250324T030121Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=f9dcbeefd8b1e13a652ee0d807b36c0a7f3e1fd1649275e9ad638ac7bdda928b"
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default PhotoPreviewGroup
