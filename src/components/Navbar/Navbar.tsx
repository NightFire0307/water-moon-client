import type { FC } from 'react'
import NavbarExpand from '@/components/Navbar/NavbarExpand.tsx'
import { useOrderInfoContext } from '@/contexts/OrderInfoContext'
import { DownOutlined } from '@ant-design/icons'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { Button } from 'antd'
import cs from 'classnames'
import { useMemo, useState } from 'react'

const Navbar: FC = () => {
  const [extended, setExtended] = useState(false)
  const { order_number } = useOrderInfoContext()

  const transitions = useTransition(extended, {
    from: { opacity: 1, translateY: '-100%' },
    enter: { opacity: 1, translateY: '0' },
    leave: { opacity: 1, translateY: '-100%' },
    config: { tension: 200, friction: 20 },
  })

  const props = useSpring({
    rotateZ: extended ? 180 : 0,
    config: { tension: 200, friction: 20 },
  })

  const navbarClass = useMemo(() => {
    return cs(
      'rounded-xl bg-gradient-to-r from-darkBlueGray-900 to-darkBlueGray-700 pl-4 pr-4 pt-2 pb-2 h-full flex justify-between items-center text-white relative z-10',
      extended ? 'rounded-bl-none rounded-br-none' : '',
    )
  }, [extended])

  const handleExtended = () => {
    setExtended(prev => !prev)
  }

  return (
    <div className="relative w-full h-full">
      <div className={navbarClass}>
        <div className="flex items-center">
          <div className="w-1.5 h-10 bg-darkBlueGray-400 rounded-lg" />
          <div className="flex flex-col leading-none ml-4">
            <div className="flex items-center mb-1">
              <div className="text-xl font-bold ">在线选片系统</div>
              <div className="text-sm font-medium bg-darkBlueGray-600 ml-2 pr-2 pl-2 pt-1 pb-1 rounded-md">{`当前订单号: WK-${order_number ?? ''}`}</div>
            </div>
            <span className="text-darkBlueGray-400">张先生 & 李小姐 · 2025年10月15日</span>
          </div>
        </div>
        <div>
          <Button type="text" className="text-white" onClick={handleExtended}>
            详情
            <animated.span style={props}>
              <DownOutlined />
            </animated.span>
          </Button>
        </div>
      </div>
      {transitions((style, item) => (
        item && (
          <animated.div style={{ ...style, position: 'absolute', width: '100%', zIndex: 1 }}>
            <NavbarExpand />
          </animated.div>
        )
      ))}
    </div>
  )
}

export default Navbar
