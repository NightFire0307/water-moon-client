// antd 主题色配置
import type { ThemeConfig } from 'antd'

export const DarkBlueTheme: ThemeConfig = {
  token: {
    colorPrimary: '#475569',
    colorPrimaryHover: '#334155', // darkBlueGray-700
    colorPrimaryActive: '#1e293b', // darkBlueGray-800
    colorBgElevated: '#334155',
    colorBorder: '#475569',
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
      defaultActiveBg: '#0f172a',
      defaultActiveBorderColor: '#1e293b',
      defaultActiveColor: '#e2e8f0',
      defaultBorderColor: '#475569',
      defaultHoverBg: '#475569',
      defaultHoverBorderColor: '#475569',
      defaultHoverColor: '#ffffff',
      textTextColor: '#94a3b8',
      textHoverBg: '#475569',
      textTextActiveColor: '#cbd5e1',
      textTextHoverColor: '#f8fafc',
    },
    Checkbox: {
      colorBgContainer: '#334155',
    },
    Dropdown: {
      colorBgElevated: '#1e293b',
      colorText: '#f1f5f9',
      controlItemBgHover: '#334155',
      colorTextDisabled: '#64748b',
      borderRadiusLG: 12,
    },
    Message: {
      contentBg: '#1e293b',
    },
    Layout: {
      footerBg: '#0f172a',
      footerPadding: '0',
    },
  },
}
