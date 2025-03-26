import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, ConfigProvider } from 'antd'
import { createStyles } from 'antd-style'
import React from 'react'

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
        
      & {
          background: #1e293b;
      }

      &::before {
        content: '';
        background: linear-gradient(90deg, #324054, #1e293b);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}))

const Custom404Page: React.FC = () => {
  const { styles } = useStyle()

  return (
    <ConfigProvider button={{ className: styles.linearGradientButton }}>
      <div className="min-h-screen w-full bg-darkBlueGray-100 flex flex-col justify-center items-center gap-8">
        <div className=" max-w-md h-1/2 p-12 bg-white mx-auto rounded-xl shadow-xl">
          <div className="flex justify-center">
            <div className="flex justify-center items-center text-3xl w-16 h-16 bg-gradient-to-r from-darkBlueGray-900 to-darkBlueGray-700 text-text-onDark rounded-full">
              <QuestionCircleOutlined />
            </div>
          </div>

          <h1 className="font-bold">
            啊喔，页面去火星了
          </h1>

          <div className="text-text-secondary leading-8">
            <p>可能的原因：</p>
            <p>1.在地址栏中输入了错误的地址。</p>
            <p>2.分享的链接已过期。</p>
          </div>

          <div className="flex justify-center mt-4">
            <Button type="primary" icon={<HomeOutlined />}>返回首页</Button>
          </div>
        </div>
        <div className="text-text-muted text-sm">© 2025 在线选片系统 · 所有权利保留</div>
      </div>
    </ConfigProvider>
  )
}

export default Custom404Page
