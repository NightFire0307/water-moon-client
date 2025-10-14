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
      // Primary按钮
      colorPrimary: '#10b981', // emerald-500
      colorPrimaryHover: '#059669', // emerald-600
      colorPrimaryActive: '#047857', // emerald-700
      primaryColor: '#ffffff',
      primaryShadow: '0 2px 0 rgba(5, 150, 105, 0.1)',
      // Default按钮
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
      // Text按钮
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
    Radio: {
      colorBgContainer: '#475569', // 未选中背景
      colorBgBase: '#334155', // 选中背景
      colorBorder: '#475569', // 未选中边框
      colorPrimaryBorder: '#334155', // 选中边框
      colorText: '#94a3b8', // 未选中文字
      colorPrimary: '#f8fafc', // 选中文字
      colorPrimaryHover: '#334155', // 悬浮/选中背景
      borderRadius: 8,
    },
  },
}
