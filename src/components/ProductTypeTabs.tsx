import type { TabsProps } from 'antd'
import { Tabs } from 'antd'
import { PhotoGrid } from './PhotoGrid.tsx'

export function ProductTypeTabs() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '全部（90）',
      children: <PhotoGrid />,
    },
    {
      key: '2',
      label: '相册（2）',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: '摆台（3）',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: '摆台（4）',
      children: 'Content of Tab Pane 4',
    },
  ]

  const onChange = (key: string) => {
    console.log(key)
  }
  return <Tabs size="small" type="card" defaultActiveKey="1" items={items} onChange={onChange} />
}
