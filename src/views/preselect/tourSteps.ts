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
      title: '下一步',
      description: '预选完成后，点击这里进入下一流程。',
      target: () => refs.nextStepRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '照片状态',
      description: '这里显示当前照片的预选状态，方便随时查看。',
      target: () => refs.statusRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '预选进度',
      description: '实时展示已预选照片数量和进度。',
      target: () => refs.progressRef.current!,
      placement: 'bottomRight',
    },
    {
      title: '缩略图栏',
      description: '浏览和选择所有预选照片的缩略图。',
      target: () => refs.thumbnailsRef.current!,
      placement: 'top',
    },
  ]
}
