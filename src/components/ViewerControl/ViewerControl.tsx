import { usePhotoViewerContext } from '@/contexts/PhotoViewerContext'
import { DownOutlined, HeartOutlined, LeftOutlined, LogoutOutlined, MessageOutlined, PlusOutlined, RightOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Select, Space, Tooltip } from 'antd'
import { motion } from 'framer-motion'

export function ViewerControl() {
  const { viewerControlVisible } = usePhotoViewerContext()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: viewerControlVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 顶部控制栏 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-xl p-2 bg-darkBlueGray-800/60">
        <Space>
          <Dropdown menu={{ items: [{ label: '产品1', key: '1' }, { label: '产品2', key: '2' }] }}>
            <Button icon={<PlusOutlined />}>
              加入产品
              <DownOutlined />
            </Button>

          </Dropdown>
          <Divider type="vertical" className="border-darkBlueGray-800/30 h-6 w-1 mx-1" />
          <Button icon={<HeartOutlined />} />
          <Button icon={<MessageOutlined />} />
          <Divider type="vertical" className="border-darkBlueGray-800/30 h-6 w-1 mx-1" />
          <Button icon={<ZoomInOutlined />} />
          <Button icon={<ZoomOutOutlined />} />
          <Button icon={<RotateLeftOutlined />} />
          <Button icon={<RotateRightOutlined />} />
        </Space>
      </div>

      {/* 退出选片 */}
      <div className="absolute top-6 right-4">
        <Button icon={<LogoutOutlined />} />
      </div>

      {/* 左右翻页按钮 */}
      <div className="absolute left-4 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-800 hover:bg-darkBlueGray-700 flex items-center justify-center">
        <LeftOutlined />
      </div>

      <div className="absolute right-4 top-1/2 w-6 h-10 rounded-md bg-darkBlueGray-800 hover:bg-darkBlueGray-700 flex items-center justify-center">
        <RightOutlined />
      </div>
    </motion.div>
  )
}
