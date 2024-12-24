import type { IPhoto, IProduct } from '../views/page.tsx'
import {
  LeftOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { Divider, Form, Image, Input, type MenuProps, Modal, Space, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { PencilIcon } from '../assets/svg/CustomIcon.tsx'
import { Photo } from './Photo.tsx'
import { ProductSelectModal } from './ProductSelectModal.tsx'

interface PhotoGridProps {
  photos: IPhoto[]
  products: IProduct[]
  onClick?: (photoId: number, productId: number) => void
}

export function PhotoGrid(props: PhotoGridProps) {
  const { photos, products, onClick } = props
  const [visible, setVisible] = useState(false)
  const [productSelectModalVisible, setProductSelectModalVisible] = useState(false)
  const [dropDownMenu, setDropDownMenu] = useState<MenuProps['items']>([])

  function generateMenu(products: IProduct[]): MenuProps['items'] {
    return products.map(product => ({
      label: product.title,
      key: product.productId.toString(),
    }))
  }

  useEffect(() => {
    setDropDownMenu(generateMenu(products))
  }, [products])

  function handleDropDownClick(id: number, { key }: { key: string }) {
    onClick?.(id, +key)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ">
      <Image.PreviewGroup
        preview={{
          toolbarRender: (_, { transform: { scale }, actions: { onActive, onZoomIn, onZoomOut } }) => (
            <div className="bg-gray bg-opacity-10 pr-4 pl-4 pt-2 pb-2 rounded-[100px] text-gray-500">
              <Space size={14} className="toolbar-wrapper text-xl">
                <Tooltip title="添加备注">
                  <PencilIcon
                    className="hover:text-white cursor-pointer"
                    onClick={() => setVisible(true)}
                  />
                </Tooltip>
                <Tooltip title="选择产品">
                  <TagOutlined
                    className="hover:text-white cursor-pointer"
                    onClick={() => setProductSelectModalVisible(true)}
                  />
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
        {photos.map(photo => (
          <Photo
            photoId={photo.photoId}
            src={photo.src}
            name={photo.name}
            types={[]}
            key={photo.photoId}
            productsMenu={dropDownMenu}
            onDropDownClick={handleDropDownClick}
          />
        ))}
      </Image.PreviewGroup>
      <Modal
        centered
        open={visible}
        title="添加备注"
        okText="保存"
        onCancel={() => setVisible(false)}
        zIndex={2000}
      >
        <Form>
          <Form.Item>
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
      <ProductSelectModal
        open={productSelectModalVisible}
        products={[{ id: 1, name: '陌上花开14寸相册' }, { id: 2, name: '陌上花开12寸相册' }, { id: 3, name: '7寸单片' }, { id: 4, name: '10寸摆台' }]}
      />
    </div>
  )
}
