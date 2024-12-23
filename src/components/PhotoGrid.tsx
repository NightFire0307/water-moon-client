import { Image } from 'antd'
import { useState } from 'react'
import { Photo } from './Photo.tsx'

export function PhotoGrid() {
  const [photoItems, SetPhotoItems] = useState<string[]>(
    [
      'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
      'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
      'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    ],
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
      <Image.PreviewGroup>
        {photoItems.map((src, index) => (
          <Photo src={src} name="1231323.jpg" types={[]} key={index} />
        ))}
      </Image.PreviewGroup>
    </div>
  )
}
