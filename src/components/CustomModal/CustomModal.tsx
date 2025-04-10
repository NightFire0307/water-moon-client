import type { ModalProps } from 'antd'
import type { FC, PropsWithChildren, ReactElement } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'

interface CustomModalProps extends PropsWithChildren, ModalProps {
  title?: string
  desc?: string
  icon?: ReactElement
  onOk?: () => void
  onCancel?: () => void
  disabledOk?: boolean
}

const customModal: FC<CustomModalProps> = ({ children, title, desc, icon, onCancel, onOk, footer, closeIcon, okText, disabledOk, ...reset }) => {
  return (
    <Modal
      {...reset}
      closeIcon={null}
      footer={null}
    >
      <div className="text-darkBlueGray-200">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {
              icon && (
                <div className="flex justify-center items-center h-6 w-6 rounded-full bg-darkBlueGray-700">
                  {icon}
                </div>
              )
            }
            <h2 className="font-bold text-xl">{title}</h2>
          </div>
          {
            closeIcon !== null && <Button icon={<CloseOutlined />} shape="circle" onClick={() => onCancel && onCancel()} />
          }
        </div>
        {
          desc && <p className="text-darkBlueGray-400 font-medium mt-2">{desc}</p>
        }
      </div>

      {children}

      {
        footer !== null && (
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => onCancel && onCancel()}>取消</Button>
            <Button onClick={() => onOk && onOk()} disabled={disabledOk ?? false}>{ okText || '确定'}</Button>
          </div>
        )
      }
    </Modal>
  )
}

export default customModal
