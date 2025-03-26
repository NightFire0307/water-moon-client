import type { FC } from 'react'
import NavbarExpand from '@/components/Navbar/NavbarExpand.tsx'
import { DownOutlined } from '@ant-design/icons'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { Button, ConfigProvider } from 'antd'
import cs from 'classnames'
import { useState } from 'react'

const Navbar: FC = () => {
  const [extended, setExtended] = useState(false)
  const [props, api] = useSpring(
    () => ({
      from: { rotateZ: extended ? 180 : 0 },
    }),
    [],
  )
  const transitions = useTransition(extended, {
    from: { translateY: '-100%' },
    enter: { translateY: '0%' },
    leave: { translateY: '-100%' },
  })

  const handleExtended = () => {
    api.start({
      from: { rotateZ: extended ? 180 : 0 },
      to: { rotateZ: extended ? 0 : 180 },
    })
    setExtended(!extended)
  }

  return (
    <div className="relative">
      <div className={
        cs('rounded-xl bg-gradient-to-r from-darkBlueGray-900 to-darkBlueGray-700 pl-4 pr-4 pt-2 pb-2 h-full flex justify-between items-center text-white relative z-10', extended ? 'rounded-bl-none rounded-br-none' : '')
      }
      >
        <div className="flex items-center">
          <div className="w-1.5 h-10 bg-darkBlueGray-500 rounded-lg" />
          <div className="flex flex-col leading-none ml-4">
            <div className="flex items-center mb-1">
              <div className="text-xl font-bold ">在线选片系统</div>
              <div className="text-sm font-medium bg-darkBlueGray-600 ml-2 pr-2 pl-2 pt-1 pb-1 rounded-md">当前订单号: WK-D12345</div>
            </div>
            <span className="text-darkBlueGray-500">张先生 & 李小姐 · 2025年10月15日</span>
          </div>
        </div>
        <div>
          <ConfigProvider theme={{
            components: {
              Button: {
                textHoverBg: '#475569',
                textTextHoverColor: '#fff',
                textTextActiveColor: '#fff',
              },
            },
          }}
          >
            <Button type="text" className="text-white" onClick={handleExtended}>
              详情
              <animated.span style={props}>
                <DownOutlined />
              </animated.span>
            </Button>
          </ConfigProvider>
        </div>
      </div>
      {
        transitions((style, item) =>
          item ? <animated.div style={{ ...style, position: 'absolute', width: '100%', zIndex: 1 }}><NavbarExpand /></animated.div> : null,
        )
      }
    </div>
  )
}

export default Navbar
