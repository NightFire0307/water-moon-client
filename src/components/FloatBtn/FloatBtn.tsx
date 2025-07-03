import { type FC, type MouseEvent, type ReactElement, type ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

interface FloatBtnProps {
  title?: string
  desc?: ReactNode
  addonIcon?: ReactElement
  diffCount?: number
  price?: number
  onClick?: (e: MouseEvent) => void
}

const FloatBtn: FC<FloatBtnProps> = ({ title, desc, addonIcon, diffCount = 0, price = 0, onClick }) => {
  const [isHover, setIsHover] = useState(false)

  const floatBtnContent = (
    <div className="fixed w-[300px] bottom-10 right-12 group select-none cursor-pointer" onClick={onClick} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <div
        className="shadow-xl bg-gradient-to-r from-darkBlueGray-600 to-darkBlueGray-800 group-hover:from-darkBlueGray-700 group-hover:to-darkBlueGray-800 px-2 py-1 text-white  h-auto rounded-full flex items-center"
      >
        <div>
          {
            addonIcon && (
              <div className="flex items-center justify-center rounded-full w-8 h-8">
                { addonIcon }
              </div>
            )
          }
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-medium text-darkBlueGray-80">{title}</div>

          <div className="flex gap-2 text-xs font-medium">
            <div className="text-darkBlueGray-80 flex items-center ">
              { desc }
            </div>
            {diffCount > 0 && !isHover && (
              <div className="px-2 py-1 rounded-full bg-[#f9731633]">
                <span className="text-[#fed7aa]">{`+${diffCount}张`}</span>
              </div>
            )}
            {price > 0 && isHover && (
              <div className="px-2 py-1 rounded-full bg-[#f9731633]">
                <span className="text-[#fed7aa]">{`¥${price}元`}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(floatBtnContent, document.body)
}

export default FloatBtn
