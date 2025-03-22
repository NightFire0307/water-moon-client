import type { FC, ReactElement, ReactNode } from 'react'

interface DetailItemProps {
  title: string
  desc: ReactNode
  icon: ReactElement
}

const DetailItem: FC<DetailItemProps> = ({ title, desc, icon }) => {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-darkBlueGray-400 flex items-center justify-center rounded-md shrink-0">
        { icon }
      </div>

      <div>
        <p className="text-xs text-darkBlueGray-600">{title}</p>
        <p className="text-sm font-medium">{desc}</p>
      </div>
    </div>
  )
}

export default DetailItem
