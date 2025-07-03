import type { FC, ReactElement, ReactNode } from 'react'

interface DetailItemProps {
  title: string
  desc?: ReactNode
  icon: ReactElement
}

const DetailItem: FC<DetailItemProps> = ({ title, desc, icon }) => {
  return (
    <div className="px-4 md:px-0 flex items-center gap-2 font-medium text-darkBlueGray-800 flex-shrink-0">
      <div className="w-8 h-8 bg-darkBlueGray-300 flex items-center justify-center rounded-md shrink-0 text-base">
        { icon }
      </div>

      <div>
        <div className="text-xs text-darkBlueGray-600">{title}</div>
        <div className="text-xs">{desc}</div>
      </div>
    </div>
  )
}

export default DetailItem
