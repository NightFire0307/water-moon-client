import type { MenuProps } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'

export function UserProfile() {
  const items: MenuProps['items'] = [
    {
      key: 'currentUser',
      label: '当前用户：张三',
      icon: <UserOutlined />,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
      icon: <LogoutOutlined />,
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Avatar size={32} icon={<UserOutlined />} className="cursor-pointer" />
    </Dropdown>
  )
}
