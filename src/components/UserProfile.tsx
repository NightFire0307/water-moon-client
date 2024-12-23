import type { MenuProps } from 'antd'
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown } from 'antd'

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
    <div className="flex items-center gap-2">
      <Dropdown menu={{ items }}>
        <Avatar size={32} icon={<UserOutlined />} />
      </Dropdown>
      <Button icon={<LockOutlined />} type="primary">锁定提交</Button>
    </div>
  )
}
