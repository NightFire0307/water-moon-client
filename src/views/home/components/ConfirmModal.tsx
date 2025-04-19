import type { IProduct } from '@/stores/useProductsStore.tsx'
import type { FC, ReactElement } from 'react'
import { submitSelection } from '@/apis/order.ts'
import CustomModal from '@/components/CustomModal/CustomModal.tsx'
import { OrderInfoContext } from '@/contexts/OrderInfoContext.ts'
import { useCountDown } from '@/hooks/useCountDown.ts'
import { useProductsStore } from '@/stores/useProductsStore.tsx'
import { CheckCircleOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, message } from 'antd'
import cs from 'classnames'
import { useCallback, useContext, useEffect, useMemo } from 'react'

interface ConfirmModalProps {
  open: boolean
  onCancel?: () => void

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
                  `${product.selected_photos.length} / ${(product.photo_limit * product.count)} (${Math.round((product.selected_photos.length / (product.photo_limit * product.count)) * 100)})%`
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
  const orderInfo = useContext(OrderInfoContext)
  const { countDown, start } = useCountDown({ manual: true })

  // 过滤产品
  const filterProducts = useCallback(() => {
    return products
      .map((product) => {
        if (product.selected_photos.length < product.photo_limit * product.count) {
          return product
        }

        if (product.photo_limit === 0 && product.selected_photos.length < orderInfo!.max_select_photos) {
          return {
            ...product,
            photo_limit: orderInfo?.max_select_photos ?? product.photo_limit,
          }
        }
        return null
      })
      .filter(product => product !== null) // 确保过滤掉 null 和 undefined
  }, [products, orderInfo])

  // 未完成选片的产品
  const unFinishedProducts = useMemo(
    () => filterProducts(),
    [filterProducts],
  )

  // 提交选片结果
  const handleSubmit = async () => {
    const { msg } = await submitSelection(orderInfo!.id)
    message.success(msg)
    onCancel?.()
  }

  useEffect(() => {
    if (open)
      start()
  }, [open])

  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      centered
      title="确认提交选片结果"
      icon={<LockOutlined />}
      okText={`提交选片 ${countDown === 0 ? '' : `( ${countDown} )`}`}
      disabledOk={countDown !== 0}
      onOk={handleSubmit}
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
