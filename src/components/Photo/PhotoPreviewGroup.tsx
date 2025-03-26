import type { FC, PropsWithChildren } from 'react'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import UseDrag from '@/hooks/useDrag'
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

  const { onMouseDown, onMouseMove, onMouseUp, offsetX, offsetY } = UseDrag()

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
        <div
          className="relative px-16 font-medium"
          onClick={() => setShowControl(!showControl)}
        >
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
                  <ToolBtn icon={<ZoomInOutlined />} onClick={() => setScale(prev => Math.min(prev * 1.5, 4))} />
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

                <div className="z-10 absolute left-1/2 -translate-x-1/2 bottom-4 p-4 h-10 bg-darkBlueGray-700/60 backdrop-blur-md flex items-center gap-4 rounded-xl text-white ">
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

          <div
            draggable={false}
            className="min-h-[85vh] w-full h-full flex justify-center overflow-hidden cursor-grab"
          >
            <img
              style={{ transform: `translate3d(${offsetX}px, ${offsetY}px, 0px) scale(${scale}) rotate(${rotate}deg)` }}
              className="object-contain max-h-[85vh] "
              alt=""
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onDragStart={e => e.preventDefault()}
              src="http://127.0.0.1:9000/water-moon/D001111/10cad696dbf06f767716d36a7398283c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=pdYskaKZrc4ulTlONJbw%2F20250326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250326T125850Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=f8be20ccdc60f7df63d70d88a7a2d4c0bfc28d18c08baf15d048c19b3d2150a5"
            />
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default PhotoPreviewGroup
