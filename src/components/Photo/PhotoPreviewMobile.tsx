import type { FC, PropsWithChildren } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const PhotoPreviewMobile: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      { children}
    </div>
  )
}

export default PhotoPreviewMobile
