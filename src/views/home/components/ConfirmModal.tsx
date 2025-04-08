import type { IProduct } from '@/stores/productsStore.tsx'
import type { FC, ReactElement } from 'react'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { CheckCircleOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import cs from 'classnames'
import { useMemo } from 'react'

interface ConfirmModalProps {
  open: boolean
  onCancel: () => void
}

interface AlertContentProps {
  title: string
  type: 'success' | 'warning'
  icon?: ReactElement
  unFinishedProducts?: IProduct[]
}

// 警告内容
const AlertContent: FC<AlertContentProps> = ({ title, type, icon, unFinishedProducts }) => {
  return (
    <div className={cs('flex gap-2 font-medium', type === 'success' ? 'text-emerald-600 items-center' : 'text-amber-600 items-start')}>
      <span className="text-xl ">
        {
          icon || (type === 'success' ? <CheckCircleOutlined /> : <WarningOutlined />)
        }
      </span>
      <div>
        <div className="text-base leading-8">{title}</div>
        {
          unFinishedProducts && unFinishedProducts.map(product => (
            <div key={product.productId} className="flex justify-between">
              <span>{product.title}</span>
              <div>
                {
                  `${product.selected_photos.length} / ${(product.photo_limit * product.count)} (${(product.selected_photos.length / (product.photo_limit * product.count)) * 100})%`
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { open, onCancel } = props
  const products = useProductsStore(state => state.products)

  // 未完成选片的产品
  const unFinishedProducts = useMemo(
    () => products.filter(product => (product.photo_limit * product.count) > product.selected_photos.length),
    [products],
  )

  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      centered
      title="确认提交选片结果"
      icon={<LockOutlined />}
      okText="提交选片"
    >
      <div className="mt-1 mb-4 text-darkBlueGray-500">提交后将进入预览模式，选片结果将被锁定，无法再进行修改。</div>
      {
        unFinishedProducts.length > 0
          ? <Alert type="warning" message={<AlertContent title="以下产品选片进度未达到100%" type="warning" unFinishedProducts={unFinishedProducts} />} />
          : <Alert type="success" message={<AlertContent title="所有产品均已完成选片" type="success" />} />
      }
    </CustomModal>
  )
}
