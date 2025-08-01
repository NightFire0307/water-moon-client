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
  okButtonClassName?: string
  okButtonStyle?: React.CSSProperties
}

const customModal: FC<CustomModalProps> = (
  { children, title, desc, icon, onCancel, onOk, footer, closeIcon, okText, disabledOk, okButtonClassName, okButtonStyle, okIcon, ...reset }) => {
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
            closeIcon !== null && <Button className="absolute top-0 right-0" icon={<CloseOutlined />} onClick={() => onCancel?.()} />
          }
        </div>
        {
          desc && <p className="text-darkBlueGray-400 font-medium mt-2">{desc}</p>
        }
      </div>

      {children}

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onCancel}>取消</Button>
        <Button
          type="primary"
          onClick={() => onOk && onOk()}
          disabled={disabledOk ?? false}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold border-none  transition-all duration-200"
          style={okButtonStyle}
          icon={okIcon}
        >
          { okText || '确定'}
        </Button>
      </div>

    </Modal>
  )
}

export default customModal
