import type { FC } from 'react'
import PreSelect from '@/components/PreSelect/PreSelect'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const PreSelectPage: FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorBgElevated: '#334155',
          colorText: '#f8fafc',
          colorTextDisabled: '#64748b',
          colorTextDescription: '#94a3b8',
          controlItemBgHover: '#475569',
        },
        components: {
          Modal: {
            contentBg: '#1e293b',
          },
          Button: {
            borderColorDisabled: '#475569',
            defaultBg: '#334155',
            defaultColor: '#e2e8f0',
            defaultBorderColor: '#475569',
            defaultActiveBg: '#0f172a',
            defaultActiveBorderColor: '#1e293b',
            defaultActiveColor: '#e2e8f0',
            defaultHoverBg: '#475569',
            defaultHoverBorderColor: '#475569',
            defaultHoverColor: '#ffffff',
            textTextColor: '#94a3b8',
            textHoverBg: '#475569',
            textTextActiveColor: '#cbd5e1',
            textTextHoverColor: '#f8fafc',
          },
        },
      }}
    >
      <PreSelect />
    </ConfigProvider>
  )
}

export default PreSelectPage
