import type { IProduct } from '@/stores/productsStore.tsx'
import type { FC, ReactElement } from 'react'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { CheckCircleOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Button, ConfigProvider, Modal, Space } from 'antd'
import { createStyles } from 'antd-style'
import cs from 'classnames'
import { useMemo } from 'react'

interface ConfirmModalProps {
  open: boolean
  confirmLoading: boolean
  onSubmit: () => void
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

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
        
      & {
          background: #1e293b;
      }

      &::before {
        content: '';
        background: linear-gradient(90deg, #324054, #1e293b);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    };
    &.${prefixCls}-btn-default:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      & {
        border-color: #94a3b8;
      }

      &:hover {
        color: inherit;
        background: #f1f5f9;
      }
    },
  `,
}))

export function ConfirmModal(props: ConfirmModalProps) {
  const { open, onCancel, onSubmit, confirmLoading } = props
  const products = useProductsStore(state => state.products)
  const { styles } = useStyle()

  // 未完成选片的产品
  const unFinishedProducts = useMemo(
    () => products.filter(product => (product.photo_limit * product.count) > product.selected_photos.length),
    [products],
  )

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Modal
        footer={(
          <Space>
            <Button onClick={() => onCancel()}>取消</Button>
            <Button type="primary" onClick={() => onSubmit()} loading={confirmLoading}>确认提交</Button>
          </Space>
        )}
        open={open}
        onCancel={onCancel}
        centered
      >
        <div className="flex gap-2 items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-darkBlueGray-800">
            <LockOutlined />
          </div>
          <span className="text-xl font-bold">确认提交选片结果</span>
        </div>

        <div className="mt-1 mb-4 text-darkBlueGray-600">提交后将进入预览模式，选片结果将被锁定，无法再进行修改。</div>

        {
          unFinishedProducts.length > 0
            ? <Alert type="warning" message={<AlertContent title="以下产品选片进度未达到100%" type="warning" unFinishedProducts={unFinishedProducts} />} />
            : <Alert type="success" message={<AlertContent title="所有产品均已完成选片" type="success" />} />
        }
      </Modal>
    </ConfigProvider>
  )
}
