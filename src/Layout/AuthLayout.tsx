import type { FC } from 'react'
import { CheckCircleOutlined, ClockCircleOutlined, LockOutlined, PictureOutlined } from '@ant-design/icons'
import { Outlet } from 'react-router'

const AuthLayout: FC = () => {
  return (
    <div className=" flex h-screen text-white">
      <div className="flex flex-col justify-between md:w-1/2 p-8 bg-darkBlueGray-1000">
        <div className="flex flex-col gap-8 max-w-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex justify-center items-center bg-white rounded-md text-darkBlueGray-800 text-xl">
              <LockOutlined />
            </div>
            <div className="text-2xl font-bold">在线选片系统</div>
          </div>

          <div className="text-3xl font-bold">专业照片选择体验</div>

          <span className="text-darkBlueGray-500 leading-normal">欢迎使用我们的在线选片系统。我们为您精心挑选的照片已准备就绪，只需输入您收到的动态密码，即可开始您的专属选片之旅。</span>

          <div>
            <div className="flex gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-darkBlueGray-600 rounded-md">
                <PictureOutlined />
              </div>
              <div>
                <h3>高质量照片展示</h3>
                <p className="text-sm leading-10 text-darkBlueGray-500">以最佳分辨率和清晰度展示您的每一张照片</p>
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-darkBlueGray-600 rounded-md">
                <CheckCircleOutlined />
              </div>
              <div>
                <h3>简单直观的选择</h3>
                <p className="text-sm leading-10 text-darkBlueGray-500">轻松标记和组织您喜爱的照片，一键完成选片</p>
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 bg-darkBlueGray-600 rounded-md">
                <ClockCircleOutlined />
              </div>
              <div>
                <h3>随时随地访问</h3>
                <p className="text-sm leading-10 text-darkBlueGray-500">在任何设备上继续您的选片进度，不受时间和地点限制</p>
              </div>
            </div>
          </div>
        </div>

        <p className=" text-darkBlueGray-500 text-sm">© 2025 在线选片系统 · 所有权利保留</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-darkBlueGray-200">
        <div className="p-8 w-2/3 h-2/4 shadow-xl rounded-xl bg-white border  border-darkBlueGray-300/60">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
