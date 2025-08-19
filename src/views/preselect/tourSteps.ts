import type { TourProps } from 'antd'

export function getPreSelectTourSteps(
  refs: {
    nextStepRef: React.RefObject<HTMLElement>
    statusRef: React.RefObject<HTMLDivElement>
    progressRef: React.RefObject<HTMLDivElement>
    thumbnailsRef: React.RefObject<HTMLDivElement>
  },
): TourProps['steps'] {
  return [
    {
      title: '下一步按钮',
      description: '当预选完成后，点击此按钮进入下一环节',
      target: () => refs.nextStepRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '照片预选状态',
      description: '照片预选状态展示当前照片的预选状态',
      target: () => refs.statusRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '预选进度',
      description: '预选进度展示当前预选的进度情况',
      target: () => refs.progressRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '缩略图栏',
      description: '缩略图栏展示当前预选的所有照片缩略图',
      target: () => refs.thumbnailsRef.current!,
      placement: 'top',
    },
  ]
}
