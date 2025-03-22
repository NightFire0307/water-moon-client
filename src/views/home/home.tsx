import { PreviewModeContext } from '@/App.tsx'
import { PhotoGrid } from '@/components/PhotoGrid.tsx'
import {
  LockOutlined,
} from '@ant-design/icons'
import { FloatButton } from 'antd'
import { useContext, useState } from 'react'
import { ConfirmModal } from './components/ConfirmModal.tsx'

function Home() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const previewMode = useContext(PreviewModeContext)

  function handleSubmit() {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
        <div className="text-xl font-bold text-darkBlueGray-800">全部照片库</div>
        <div className="text-darkBlueGray-600 font-medium">(13 张照片)</div>
      </div>
      <PhotoGrid />

      {
        !previewMode && (
          <FloatButton.Group shape="circle" style={{ insetInlineEnd: 60 }}>
            <FloatButton.BackTop tooltip="返回顶部" />
            <FloatButton
              tooltip="提交选片结果"
              icon={<LockOutlined />}
              onClick={() => setConfirmOpen(true)}
            >
            </FloatButton>
          </FloatButton.Group>
        )
      }

      <ConfirmModal
        open={confirmOpen}
        confirmLoading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default Home
