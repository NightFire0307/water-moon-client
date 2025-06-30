import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Card } from 'antd'
import cs from 'classnames'

interface CustomCardProps extends PropsWithChildren {
  title: ReactNode
  className?: string
  onClick?: () => void
}

const CustomCard: FC<CustomCardProps> = ({ title, className, children, onClick }) => {
  return (
    <Card
      size="small"
      variant="borderless"
      className={cs('w-full cursor-pointer transition duration-150 ease-in-out hover:shadow-lg', className)}
      title={title}
      styles={{
        header: { background: 'linear-gradient(90deg, #1e293b, #324054)', color: '#fff' },
        body: { background: '#f9fbfd' },
      }}
      onClick={onClick}
    >
      {
        children
      }
    </Card>
  )
}

export default CustomCard
