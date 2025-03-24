import { PreviewModeContext } from '@/App.tsx'
import FloatBtn from '@/components/FloatBtn/FloatBtn.tsx'
import { PhotoGrid } from '@/components/Photo/PhotoGrid.tsx'
import { ArrowRightOutlined, LockOutlined } from '@ant-design/icons'
import { useContext, useState } from 'react'
import SimpleBar from 'simplebar-react'
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
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex items-center gap-2 mb-2 flex-grow-0">
        <div className="w-[4px] h-5 bg-darkBlueGray-800 rounded-lg" />
        <div className="text-xl font-bold text-darkBlueGray-800">全部照片库</div>
        <div className="text-darkBlueGray-600 font-medium">(13 张照片)</div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <SimpleBar style={{ maxHeight: '100%' }}>
            <PhotoGrid />
          </SimpleBar>
        </div>
      </div>

      <FloatBtn
        title="提交选片结果"
        desc={(
          <span>
            已选:
            {' '}
            {32}
            {' '}
            / 应选:
            {' '}
            {63}
          </span>
        )}
        addonIcon={<LockOutlined />}
        afterIcon={<ArrowRightOutlined />}
        onClick={() => console.log('111')}
      />

      <ConfirmModal
        open={confirmOpen}
        confirmLoading={confirmLoading}
        onCancel={() => setConfirmOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Home
