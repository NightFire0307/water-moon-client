import {
  LeftOutlined,
  RightOutlined,
  TagOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import { animated, useTransition } from '@react-spring/web'
import { Divider, Form, Image, Input, message, Modal, Space, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { PencilIcon } from '../assets/svg/CustomIcon.tsx'
import { usePhotosStore } from '../stores/photosStore.tsx'
import { useProductsStore } from '../stores/productsStore.tsx'
import { Photo } from './Photo.tsx'
import { ProductSelectModal } from './ProductSelectModal.tsx'

export function PhotoGrid() {
  const [visible, setVisible] = useState(false)
  const [productSelectModalVisible, setProductSelectModalVisible] = useState(false)
  const [currentPhotoId, setCurrentPhotoId] = useState<number>(-1)
  const { updateProductSelected } = useProductsStore()
  const {
    photos,
    selectedFilter,
    updatePhotoAddTagMenus,
    removeAllMarkedProduct,
    removeMarkedProductByPhotoId,
    updatePhotoRemoveTagMenus,
    removePhotoRemoveTagMenus,
    updatePhotoMarkedProductTypes,
    generateAddTagMenu,
  } = usePhotosStore()

  const filterPhotos = photos.filter((photo) => {
    if (selectedFilter === 'selected')
      return photo.markedProducts.length > 0
    if (selectedFilter === 'unselected')
      return photo.markedProducts.length === 0
    return true
  })

  const [transitions, api] = useTransition(filterPhotos, () => ({
    from: { opacity: 0, transform: 'translateX(50%) scale(0.8)' },
    enter: { opacity: 1, transform: 'translateX(0%) scale(1)', position: 'relative' },
    leave: { opacity: 0, transform: 'translateX(-50%) scale(0.8)', position: 'absolute' },
    keys: photo => photo.photoId,
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  useEffect(() => {
    api.start()
  }, [filterPhotos])

  useEffect(() => {
    generateAddTagMenu()
  }, [])

  function handleDropDownClick(key: string, photoId: number) {
    const [actionType, productId] = key.split('_')

    switch (actionType) {
      case 'addTag':
        updateProductSelected(+productId, photoId)
        updatePhotoAddTagMenus(photoId, +productId)
        updatePhotoRemoveTagMenus(photoId, +productId)
        updatePhotoMarkedProductTypes(photoId, +productId)
        break
      case 'removeTag':
        removePhotoRemoveTagMenus(photoId, +productId)
        updatePhotoAddTagMenus(photoId, +productId, false)
        removeMarkedProductByPhotoId(photoId, +productId)
        break
      case 'removeAllTag':
        removeAllMarkedProduct(photoId)
        break
      case 'add_note':
        setVisible(true)
        break
      default:
        message.error('未知操作')
    }
  }

  function findImageIdByUrl(url: string) {
    const photo = photos.find(photo => photo.src === url)
    return photo?.photoId
  }

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-10 gap-4 relative">
      <Image.PreviewGroup
        preview={{
          toolbarRender: (_, { transform: { scale }, actions: { onActive, onZoomIn, onZoomOut }, image }) => (
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
                    onClick={() => {
                      const photoId = findImageIdByUrl(image.url)
                      setCurrentPhotoId(photoId!)
                      setProductSelectModalVisible(true)
                    }}
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
        {
          transitions((style, photo) => (
            <animated.div key={photo.photoId} style={{ ...style }}>
              <Photo
                photoId={photo.photoId}
                src={photo.src}
                name={photo.name}
                products={photo.markedProducts}
                addProductsMenus={photo.addTagMenus}
                removeProductsMenus={photo.removeTagMenus}
                onDropDownClick={handleDropDownClick}
              />
            </animated.div>
          ))
        }
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
        photoId={currentPhotoId}
        onSubmit={() => {}}
        onClose={() => setProductSelectModalVisible(false)}
      />
    </div>
  )
}
