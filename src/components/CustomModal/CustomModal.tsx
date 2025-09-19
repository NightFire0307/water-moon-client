import type { ModalProps } from 'antd'
import type { FC, PropsWithChildren, ReactElement } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'

interface CustomModalProps extends PropsWithChildren, ModalProps {
  desc?: string
  icon?: ReactElement
  onOk?: () => void
  onCancel?: () => void
  disabledOk?: boolean
  okIcon?: ReactElement
}

const customModal: FC<CustomModalProps> = (props) => {
  const {
    children,
    closable = true,
    closeIcon,
    cancelText = '取消',
    desc,
    disabledOk,
    footer,
    icon,
    onCancel,
    onOk,
    okText,
    okIcon,
    title,
    ...reset
  } = props

  return (
    <Modal
      {...reset}
      title={null}
      closeIcon={null}
      footer={null}
    >
      <div className="text-darkBlueGray-200 mb-4">
        <div className="relative">
          <div className="font-bold text-xl text-center">{title}</div>
          {
            closable && (
              <Button
                className="absolute top-0 right-0"
                icon={closeIcon || <CloseOutlined />}
                onClick={() => onCancel?.()}
              />
            )
          }
        </div>
        {
          desc && <p className="text-darkBlueGray-400 font-medium mt-2">{desc}</p>
        }
      </div>

      {children}

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button
          type="primary"
          onClick={() => onOk && onOk()}
          disabled={disabledOk ?? false}
          icon={okIcon}
        >
          { okText || '确定'}
        </Button>
      </div>

    </Modal>
  )
}

export default customModal
