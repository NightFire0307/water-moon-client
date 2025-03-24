import type { FC } from 'react'
import { useProductsStore } from '@/stores/productsStore.tsx'
import { LockOutlined, WarningOutlined } from '@ant-design/icons'
import { Alert, Button, ConfigProvider, Modal, Space } from 'antd'
import { createStyles } from 'antd-style'

interface ConfirmModalProps {
  open: boolean
  confirmLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

// 警告内容
const AlertContent: FC = () => {
  const products = useProductsStore(state => state.products)

  // 未完成的选片
  const unFinishedProducts = products.filter(product => product.photo_limit > product.selected_photos.length)

  return (
    <div className="flex items-start gap-2 text-amber-600 font-medium">
      <span className="text-xl ">
        <WarningOutlined />
      </span>
      <div>
        <div className="text-base leading-8">以下产品选片进度未达到100%</div>
        {
          unFinishedProducts.map(product => (
            <div key={product.productId} className="flex justify-between">
              <span>{product.title}</span>
              <div>
                {
                  `${product.selected_photos.length} / ${product.photo_limit} (${(product.selected_photos.length / product.photo_limit) * 100})%`
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
  const { styles } = useStyle()

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Modal
        footer={(
          <Space>
            <Button>取消</Button>
            <Button type="primary">确认提交</Button>
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

        <div className="my-1 text-darkBlueGray-600">提交后将进入预览模式，选片结果将被锁定，无法再进行修改。</div>

        <Alert type="warning" message={<AlertContent />} />
      </Modal>
    </ConfigProvider>
  )
}
