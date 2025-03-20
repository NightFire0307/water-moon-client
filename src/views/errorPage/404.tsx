import { Button, Result } from 'antd'
import React from 'react'

const App: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起你访问的页面不存在"
    extra={<Button type="primary">返回首页</Button>}
  />
)

export default App
