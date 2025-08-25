import type { TourProps } from 'antd'

export function getProductSelectTourSteps(
  refs: {
    photoFilterBarRef: HTMLElement
    productBarRef: HTMLElement
    actionBarRef: HTMLElement
    addToProductRef: HTMLElement
    remarkRef: HTMLElement
  },
): TourProps['steps'] {
  return [
    {
      title: '照片筛选栏',
      description: '按“所有照片”、“已选照片”、“未选照片”分类浏览，便于快速筛选和管理。',
      target: refs.photoFilterBarRef,
      placement: 'bottomRight',
    },
    {
      title: '产品栏',
      description: '选择对应的产品，自动筛选相关照片。',
      target: refs.productBarRef,
      placement: 'bottomRight',
    },
    {
      title: '加入产品',
      description: '选中照片后，可一键添加至产品。',
      target: refs.addToProductRef,
    },
    {
      title: '备注',
      description: '为照片添加备注，如修饰要求等。',
      target: refs.remarkRef,
    },
    {
      title: '操作栏',
      description: '使用放大、缩小、旋转等工具调整照片显示效果。',
      target: refs.actionBarRef,
    },
  ]
}
