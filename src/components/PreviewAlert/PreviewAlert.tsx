import type { FC } from 'react'
import { LockOutlined } from '@ant-design/icons'
import { animated, config, useSpring } from '@react-spring/web'

const PreviewAlert: FC = () => {
  const [props] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
  }), [])

  return (
    <animated.div style={props}>
      <div className="flex items-center mb-4 h-16 bg-darkBlueGray-50 rounded-md overflow-hidden before:contet-[''] before:block before:h-full before:w-1 before:bg-darkBlueGray-900">
        <div className="mx-3 flex justify-center items-center h-8 w-8 bg-darkBlueGray-800 text-white text-base rounded-full">
          <LockOutlined />
        </div>
        <div className="flex flex-col gap-1">
          <div>预览模式</div>
          <div className="text-darkBlueGray-600">您的选片结果已提交，当前处于预览模式。选片结果已锁定，无法再进行修改。</div>
        </div>
      </div>
    </animated.div>
  )
}

export default PreviewAlert
