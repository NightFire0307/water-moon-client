import {
  LeftOutlined,
  MessageOutlined,
  RightOutlined,
  SelectOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Divider, Form, Image, Input, Modal, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { Photo } from './Photo.tsx'

export function PhotoGrid() {
  const [photoItems, SetPhotoItems] = useState<string[]>(
    [
      'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
      'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
      'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ],
  )
  const [visible, setVisible] = useState(false)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ">
      <Image.PreviewGroup
        preview={{
          toolbarRender: (_, { transform: { scale }, actions: { onActive, onZoomIn, onZoomOut } }) => (
            <div className="bg-gray bg-opacity-10 pr-4 pl-4 pt-2 pb-2 rounded-[100px] text-gray-500">
              <Space size={14} className="toolbar-wrapper text-xl">
                <Tooltip title="添加备注">
                  <MessageOutlined
                    className="hover:text-white cursor-pointer"
                    onClick={() => setVisible(true)}
                  />
                </Tooltip>
                <Tooltip title="选择产品">
                  <SelectOutlined className="hover:text-white cursor-pointer" />
                </Tooltip>
                <Divider type="vertical" className="border-[#bfbfbf]" />
                <Tooltip title="上一张">
                  <LeftOutlined className="hover:text-white" onClick={() => onActive?.(-1)} />
                </Tooltip>
                <Tooltip title="下一张">
                  <RightOutlined className="hover:text-white" onClick={() => onActive?.(1)} />
                </Tooltip>
                <Tooltip title="缩小">
                  <ZoomOutOutlined className="hover:text-white" disabled={scale === 1} onClick={onZoomOut} />
                </Tooltip>
                <Tooltip title="放大">
                  <ZoomInOutlined className="hover:text-white" disabled={scale === 50} onClick={onZoomIn} />
                </Tooltip>
              </Space>
            </div>
          ),
        }}
      >
        {photoItems.map((src, index) => (
          <Photo src={src} name="1231323.jpg" types={[]} key={index} />
        ))}
      </Image.PreviewGroup>
      <Modal centered open={visible} title="添加备注">
        <Form>
          <Form.Item>
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
