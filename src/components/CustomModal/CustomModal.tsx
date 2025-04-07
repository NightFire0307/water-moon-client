import type { ModalProps } from 'antd'
import type { FC, PropsWithChildren, ReactElement } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Modal } from 'antd'

interface CustomModalProps extends PropsWithChildren, ModalProps {
  title?: string
  desc?: string
  icon?: ReactElement
  onOk?: () => void
  onCancel?: () => void
}

const customModal: FC<CustomModalProps> = ({ children, title, desc, icon, onCancel, onOk, footer, closeIcon, ...reset }) => {
  return (
    <ConfigProvider theme={{
      components: {
        Modal: {
          contentBg: '#1e293b',
        },
        Button: {
          defaultBg: '#1e293b',
          defaultColor: '#e2e8f0',
          defaultBorderColor: '#334155',
          defaultActiveBg: '#0f172a',
          defaultActiveBorderColor: '#1e293b',
          defaultActiveColor: '#e2e8f0',
          defaultHoverBg: '#334155',
          defaultHoverBorderColor: '#475569',
          defaultHoverColor: '#ffffff',
        },
        Input: {
          activeBg: '#1e293b',
          activeBorderColor: '#475569',
          activeShadow: '#020617',
        },
      },
    }}
    >
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
          <p className="text-darkBlueGray-400 font-medium mt-2">{desc}</p>
        </div>

        {children}

        {
          footer !== null && (
            <div className="flex justify-end gap-2">
              <Button onClick={() => onCancel && onCancel()}>取消</Button>
              <Button onClick={() => onOk && onOk()}>保存备注</Button>
            </div>
          )
        }
      </Modal>
    </ConfigProvider>
  )
}

export default customModal
