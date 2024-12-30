import { LoadingOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useProductsStore } from '../../../stores/productsStore.tsx'
import { ValidationResult } from './ValidationResult.tsx'

interface ConfirmModalProps {
  open: boolean
  confirmLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function ConfirmModal(props: ConfirmModalProps) {
  const { open, onCancel, onSubmit, confirmLoading } = props
  // 倒计时
  const [countDown, setCountDown] = useState(5)
  const [allSelect, setAllSelect] = useState(false)
  const timer = useRef(0)
  const products = useProductsStore(state => state.products)

  // 校验产品是否全部选片
  function checkAllSelected() {
    for (let i = 0; i < products.length; i++) {
      if (products[i].selected.length < products[i].total) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    setAllSelect(checkAllSelected())

    return () => setCountDown(5)
  }, [open, products])

  useEffect(() => {
    if (!allSelect)
      return

    if (countDown !== 0) {
      timer.current = setTimeout(() => {
        setCountDown(prevCount => prevCount - 1)
      }, 1000)
    }
    else {
      setAllSelect(true)
    }

    return () => {
      clearTimeout(timer.current)
    }
  }, [allSelect, countDown])

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            headerBg: '#e6f4ff',
            contentBg: '#e6f4ff',
          },
        },
      }}
    >
      <Modal
        styles={{
          content: { padding: '0px' },
        }}
        footer={null}
        open={open}
        onCancel={onCancel}
      >
        <div className="w-full text-center text-2xl pt-4 font-bold text-[#002c8c]">确认提交</div>
        {/* <p className="text-[red] font-bold">提交选片结果后将无法更改，是否确认提交？</p> */}
        <div className="p-6">
          <ValidationResult allSelect={allSelect} />
        </div>

        <div className="bg-white flex gap-4 justify-end p-6 rounded-b-2xl">
          <Button onClick={onCancel}>取消</Button>
          <Button
            type="primary"
            disabled={countDown !== 0 || confirmLoading}
            onClick={onSubmit}
            icon={confirmLoading ? <LoadingOutlined /> : null}
          >
            确认提交
            {' '}
            {
              countDown !== 0 && allSelect ? `(${countDown})` : null
            }
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  )
}
