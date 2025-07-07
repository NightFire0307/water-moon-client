import type { MenuProps } from 'antd'
import type { FC } from 'react'
import ToolBtn from '@/components/Photo/ToolBtn.tsx'
import {
  CloseOutlined,
  LeftOutlined,
  MessageOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Dropdown } from 'antd'

interface PhotoPreviewToolbarProps {
  isPreview: boolean
  dropdownOpen: boolean
  productItems: MenuProps['items']
  onDropdownMouseEnter: () => void
  onProductClick: (key: string) => void
  onRemarkClick: () => void
  onZoomOut: () => void
  onZoomIn: () => void
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

const PhotoPreviewToolbar: FC<PhotoPreviewToolbarProps> = ({
  isPreview,
  dropdownOpen,
  productItems,
  onDropdownMouseEnter,
  onProductClick,
  onRemarkClick,
  onZoomOut,
  onZoomIn,
  onClose,
  onPrev,
  onNext,
  canPrev,
  canNext,
}) => {
  const defaultItems: MenuProps['items'] = [
    { key: 'default', label: '标记产品', disabled: true },
    { type: 'divider' },
  ]

  return (
    <>
      {/* 顶部工具栏 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
        {!isPreview && (
          <Dropdown
            open={dropdownOpen}
            menu={{
              items: [...defaultItems, ...productItems ?? []],
              onClick: ({ key }) => onProductClick(key),
            }}
          >
            <ToolBtn
              icon={<TagOutlined />}
              onMouseEnter={onDropdownMouseEnter}
            />
          </Dropdown>
        )}

        <ToolBtn icon={<MessageOutlined />} onClick={onRemarkClick} />
        <ToolBtn icon={<ZoomOutOutlined />} onClick={onZoomOut} />
        <ToolBtn icon={<ZoomInOutlined />} onClick={onZoomIn} />
      </div>

      {/* 关闭按钮 */}
      <div className="absolute top-4 right-4">
        <ToolBtn icon={<CloseOutlined />} onClick={onClose} />
      </div>

      {/* 左右切换按钮 */}
      <div className="absolute left-4 top-1/2">
        <ToolBtn
          icon={<LeftOutlined />}
          onClick={onPrev}
          disabled={!canPrev}
        />
      </div>
      <div className="absolute right-4 top-1/2">
        <ToolBtn
          icon={<RightOutlined />}
          onClick={onNext}
          disabled={!canNext}
        />
      </div>
    </>
  )
}

export default PhotoPreviewToolbar
