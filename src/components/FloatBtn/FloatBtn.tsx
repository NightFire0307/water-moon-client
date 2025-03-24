import type { FC, MouseEvent, ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface FloatBtnProps {
  title: string
  desc?: ReactNode
  addonIcon?: ReactElement
  afterIcon?: ReactElement
  onClick?: (e: MouseEvent) => void
}

const FloatBtn: FC<FloatBtnProps> = ({ title, desc, addonIcon, afterIcon, onClick }) => {
  const floatBtnContent = (
    <div className="absolute bottom-10 right-12 group select-none cursor-pointer" onClick={onClick}>
      <div
        className="bg-gradient-to-r from-darkBlueGray-700 to-darkBlueGray-900 group-hover:from-darkBlueGray-800 group-hover:to-darkBlueGray-1000 px-4 text-white py-3  h-auto rounded-full flex items-center"
      >
        <div className="flex items-center">
          {
            addonIcon && (
              <div className="flex items-center justify-center bg-white/20 rounded-full w-8 h-8 mr-2">
                { addonIcon }
              </div>
            )
          }

          <div className="mr-1 leading-normal">
            <div className="text-center text-sm font-bold">{title}</div>
            <div className="text-xs text-darkBlueGray-500 flex items-center">
              { desc }
            </div>
          </div>
          {
            afterIcon && (
              <span className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                { afterIcon }
              </span>
            )
          }
        </div>
      </div>
    </div>
  )

  return createPortal(floatBtnContent, document.body)
}

export default FloatBtn
